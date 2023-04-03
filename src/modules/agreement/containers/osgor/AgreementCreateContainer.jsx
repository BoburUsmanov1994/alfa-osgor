import React, {useEffect, useMemo, useState} from 'react';
import {useSettingsStore, useStore} from "../../../../store";
import {get, isEqual} from "lodash";
import Panel from "../../../../components/panel";
import Search from "../../../../components/search";
import {Col, Row} from "react-grid-system";
import Section from "../../../../components/section";
import Title from "../../../../components/ui/title";
import Button from "../../../../components/ui/button";
import Form from "../../../../containers/form/form";
import Flex from "../../../../components/flex";
import Field from "../../../../containers/form/field";
import {useGetAllQuery, usePostQuery} from "../../../../hooks/api";
import {KEYS} from "../../../../constants/key";
import {URLS} from "../../../../constants/url";
import {getSelectOptionsListFromData} from "../../../../utils";
import {OverlayLoader} from "../../../../components/loader";
import qrcodeImg from "../../../../assets/images/qrcode.png"
import dayjs from "dayjs";

const AgreementCreateContainer = ({...rest}) => {
    const [person, setPerson] = useState(null)
    const [organziation, setOrganization] = useState(null)
    const [insurant, setInsurant] = useState('person')
    const [passportSeries, setPassportSeries] = useState(null)
    const [passportNumber, setPassportNumber] = useState(null)
    const [pinfl, setPinfl] = useState(null)
    const [birthDate, setBirthDate] = useState(null)
    const [inn, setInn] = useState(null)
    const [regionId, setRegionId] = useState(null)
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [{
        id: 1, title: 'OSGOR', path: '/osgor/list',
    }, {
        id: 2, title: 'Добавить OSGOR', path: '/osgor/create',
    }], [])


    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const {data: filials, isLoading: isLoadingFilials} = useGetAllQuery({key: KEYS.agencies, url: URLS.agencies})
    const filialList = getSelectOptionsListFromData(get(filials, `data.result`, []), 'id', 'name')

    const {data: insuranceTerms, isLoading: isLoadingInsuranceTerms} = useGetAllQuery({
        key: KEYS.insuranceTerms, url: URLS.insuranceTerms
    })
    const insuranceTermsList = getSelectOptionsListFromData(get(insuranceTerms, `data.result`, []), 'id', 'name')

    const {data: country, isLoading: isLoadingCountry} = useGetAllQuery({
        key: KEYS.countries, url: URLS.countries
    })
    const countryList = getSelectOptionsListFromData(get(country, `data.result`, []), 'id', 'name')

    const {data: region, isLoading: isLoadingRegion} = useGetAllQuery({
        key: KEYS.regions, url: URLS.regions
    })
    const regionList = getSelectOptionsListFromData(get(region, `data.result`, []), 'id', 'name')

    const {data: district, isLoading: isLoadingDistrict} = useGetAllQuery({
        key: [KEYS.districts,regionId],
        url: URLS.districts,
        params:{
           params:{
               region:regionId
           }
        },
        enabled:!!(regionId || get(person,'regionId'))
    })
    const districtList = getSelectOptionsListFromData(get(district, `data.result`, []), 'id', 'name')

    const {
        mutate: getPersonalInfoRequest, isLoading: isLoadingPersonalInfo
    } = usePostQuery({listKeyId: KEYS.personalInfoProvider})

    const getInfo = () => {
        getPersonalInfoRequest({
                url: URLS.personalInfoProvider, attributes: {
                    pinfl, birthDate: dayjs(birthDate).format('YYYY-MM-DD'), passportSeries, passportNumber
                }
            },
            {
                onSuccess: ({data}) => {
                    setPerson(get(data, 'result'))
                }
            }
        )
    }
    const getFieldData = (name, value) => {
        if(isEqual(name,'insurant.person.regionId')){
            setRegionId(value)
        }
    }

    if (isLoadingFilials || isLoadingInsuranceTerms || isLoadingCountry || isLoadingRegion ) {
        return <OverlayLoader/>
    }

    console.log('person', person)
    console.log('regionId', regionId)

    return (<>
        {isLoadingPersonalInfo && <OverlayLoader/>}
        <Panel>
            <Row>
                <Col xs={12}>
                    <Search/>
                </Col>
            </Row>
        </Panel>
        <Section>
            <Row>
                <Col xs={12}>
                    <Title>Параметры полиса</Title>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <Form getValueFromField={(value, name) => getFieldData(name, value)}
                          footer={<Flex className={'mt-32'}><Button className={'mr-16'}>Сохранить</Button><Button
                              danger className={'mr-16'}>Удалить</Button><Button gray className={'mr-16'}>Подтвердить
                              оплату</Button><Button gray className={'mr-16'}>Отправить в Фонд</Button></Flex>}>
                        <Row gutterWidth={60} className={'mt-32'}>
                            <Col xs={4} style={{borderRight: '1px solid #DFDFDF'}}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Статус</Col>
                                    <Col xs={7}><Button green>Новый</Button></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Филиал</Col>
                                    <Col xs={7}><Field options={filialList} params={{required: true}}
                                                       property={{hideLabel: true}} type={'select'}
                                                       name={'agencyId'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Серия договора:</Col>
                                    <Col xs={7}><Field property={{hideLabel: true}} type={'input'}
                                                       name={'seria'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Номер договора: </Col>
                                    <Col xs={7}><Field property={{hideLabel: true}} type={'input'}
                                                       name={'number'}/></Col>
                                </Row>

                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Дата начала договора: </Col>
                                    <Col xs={7}><Field property={{hideLabel: true}} type={'datepicker'}
                                                       name={'contractStartDate'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Дата окончания договора: </Col>
                                    <Col xs={7}><Field property={{hideLabel: true}} type={'datepicker'}
                                                       name={'contractEndDate'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Общая сумма договора: </Col>
                                    <Col xs={7}><Field property={{hideLabel: true}} type={'number-format-input'}
                                                       name={'sum'}/></Col>
                                </Row>

                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={6} className={'text-center'}>
                                        <img src={qrcodeImg} alt=""/>
                                    </Col>
                                    <Col xs={6}>
                                        <Button type={'button'}>Проверить полис</Button>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Страховая сумма: </Col>
                                    <Col xs={7}><Field property={{hideLabel: true}} type={'number-format-input'}
                                                       name={'policies[0].insuranceSum'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Страховая премия: </Col>
                                    <Col xs={7}><Field property={{hideLabel: true}} type={'number-format-input'}
                                                       name={'policies[0].insurancePremium'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Срок страхования:</Col>
                                    <Col xs={7}><Field options={insuranceTermsList} params={{required: true}}
                                                       label={'Insurance term'} property={{hideLabel: true}}
                                                       type={'select'}
                                                       name={'policies[0].insuranceTermId'}/></Col>
                                </Row>

                            </Col>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Дата выдачи полиса: </Col>
                                    <Col xs={7}><Field property={{hideLabel: true}} type={'datepicker'}
                                                       name={'policies[0].issueDate'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Дата начала покрытия: </Col>
                                    <Col xs={7}><Field property={{hideLabel: true}} type={'datepicker'}
                                                       name={'policies[0].startDate'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Дача окончания покрытия: </Col>
                                    <Col xs={7}><Field property={{hideLabel: true}} type={'datepicker'}
                                                       name={'policies[0].endDate'}/></Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row gutterWidth={60} className={'mt-15'}>
                            <Col xs={12} className={'mb-15'}><Title sm>Страхователь</Title></Col>
                            <Col xs={12}>
                                <Row>
                                    <Col xs={4}>
                                        <Flex>
                                            <h4 className={'mr-16'}>Страхователь</h4>
                                            <Button onClick={() => setInsurant('person')}
                                                    gray={!isEqual(insurant, 'person')} className={'mr-16'}
                                                    type={'button'}>Физ. лицо</Button>
                                            <Button onClick={() => setInsurant('organization')}
                                                    gray={!isEqual(insurant, 'organization')} type={'button'}>Юр.
                                                лицо</Button>
                                        </Flex>
                                    </Col>
                                    <Col xs={8} className={'text-right'}>
                                        {isEqual(insurant, 'person') && <Flex justify={'flex-end'}>
                                            <Field onChange={(e) => setPassportSeries(e.target.value)}
                                                   className={'mr-16'} style={{width: 75}}
                                                   property={{
                                                       hideLabel: true, mask: 'aa', placeholder: 'AA', maskChar: '_'
                                                   }}
                                                   name={'passportSeries'}
                                                   type={'input-mask'}
                                            />
                                            <Field onChange={(e) => setPassportNumber(e.target.value)} property={{
                                                hideLabel: true,
                                                mask: '9999999',
                                                placeholder: '1234567',
                                                maskChar: '_'
                                            }} name={'passportNumber'} type={'input-mask'}/>
                                            <Field onChange={(e) => setPinfl(e.target.value)} className={'ml-15'}
                                                   property={{
                                                       hideLabel: true,
                                                       mask: '99999999999999',
                                                       placeholder: 'PINFL',
                                                       maskChar: '_'
                                                   }} name={'pinfl'} type={'input-mask'}/>
                                            <Field className={'ml-15'}
                                                   property={{
                                                       hideLabel: true,
                                                       placeholder: 'Дата рождения',
                                                       onChange: (e) => setBirthDate(e)
                                                   }}
                                                   name={'birthDate'} type={'datepicker'}/>
                                            <Button onClick={getInfo} className={'ml-15'} type={'button'}>Получить
                                                данные</Button>
                                        </Flex>}
                                        {isEqual(insurant, 'organization') && <Flex justify={'flex-end'}>
                                            <Field property={{
                                                hideLabel: true,
                                                mask: '999999999',
                                                placeholder: 'Inn',
                                                maskChar: '_'
                                            }} name={'inn'} type={'input-mask'}/>

                                            <Button onClick={getInfo} className={'ml-15'} type={'button'}>Получить
                                                данные</Button>
                                        </Flex>}
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={12}>
                                <hr className={'mt-15 mb-15'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field defaultValue={get(person, 'firstNameLatin')} label={'Firstname'} type={'input'}
                                       name={'insurant.person.fullName.firstname'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field defaultValue={get(person, 'lastNameLatin')} label={'Lastname'} type={'input'}
                                       name={'insurant.person.fullName.lastname'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field defaultValue={get(person, 'middleNameLatin')} label={'Middlename'} type={'input'}
                                       name={'insurant.person.fullName.middlename'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field defaultValue={pinfl} label={'ПИНФЛ'} type={'input'}
                                       name={'insurant.person.passportData.pinfl'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field property={{
                                    mask: 'aa',
                                    placeholder: 'AA',
                                    maskChar: '_'
                                }} defaultValue={passportSeries} label={'Passport seria'} type={'input-mask'}
                                       name={'insurant.person.passportData.seria'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field property={{
                                    mask: '9999999',
                                    placeholder: '1234567',
                                    maskChar: '_'
                                }} defaultValue={passportNumber} label={'Passport number'} type={'input-mask'}
                                       name={'insurant.person.passportData.number'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    defaultValue={dayjs(get(person, 'birthDate')).toDate()}
                                    label={'Birth date'}
                                    type={'datepicker'}
                                    name={'insurant.person.birthDate'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    defaultValue={get(person, 'gender')}
                                    label={'Gender'}
                                    type={'select'}
                                    name={'insurant.person.gender'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    options={countryList}
                                    defaultValue={get(person, 'countryId')}
                                    label={'Country'}
                                    type={'select'}
                                    name={'insurant.person.countryId'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    options={regionList}
                                    defaultValue={get(person, 'regionId')}
                                    label={'Region'}
                                    type={'select'}
                                    name={'insurant.person.regionId'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    options={districtList}
                                    defaultValue={get(person, 'districtId')}
                                    label={'District'}
                                    type={'select'}
                                    name={'insurant.person.districtId'}/>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Section>
    </>);
};

export default AgreementCreateContainer;