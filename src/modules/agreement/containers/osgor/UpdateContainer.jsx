import React, {useEffect, useMemo, useState} from 'react';
import {useSettingsStore, useStore} from "../../../../store";
import {find, get, head, isEmpty, isEqual, isNil, round, upperCase} from "lodash";
import Panel from "../../../../components/panel";
import Search from "../../../../components/search";
import {Col, Row} from "react-grid-system";
import Section from "../../../../components/section";
import Title from "../../../../components/ui/title";
import Button from "../../../../components/ui/button";
import Form from "../../../../containers/form/form";
import Flex from "../../../../components/flex";
import Field from "../../../../containers/form/field";
import {useGetAllQuery, usePostQuery, usePutQuery} from "../../../../hooks/api";
import {KEYS} from "../../../../constants/key";
import {URLS} from "../../../../constants/url";
import {getSelectOptionsListFromData} from "../../../../utils";
import {OverlayLoader} from "../../../../components/loader";
import qrcodeImg from "../../../../assets/images/qrcode.png"
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

const getEndDateByInsuranceTerm = (term, startDate) => {
    if (!isNil(term)) {
        if (get(term, 'prefix') == 'day') {
            return dayjs(startDate).add(get(term, 'value') - 1, get(term, 'prefix')).toDate()
        }
        if (get(term, 'prefix') == 'month') {
            return dayjs(startDate).add(get(term, 'value'), get(term, 'prefix')).subtract(1, 'day').toDate()
        }
        if (get(term, 'prefix') == 'year') {
            return dayjs(startDate).add(get(term, 'value'), get(term, 'prefix')).subtract(1, 'day').toDate()
        }

    }
    return dayjs()
}

const UpdateContainer = ({form_id}) => {
    const [person, setPerson] = useState(null)
    const [agentId, setAgentId] = useState(null)
    const [organization, setOrganization] = useState(null)
    const [insurant, setInsurant] = useState('person')
    const [passportSeries, setPassportSeries] = useState(null)
    const [passportNumber, setPassportNumber] = useState(null)
    const [birthDate, setBirthDate] = useState(null)
    const [inn, setInn] = useState(null)
    const [regionId, setRegionId] = useState(null)
    const [agencyId, setAgencyId] = useState(null)
    const [insuranceTerm, setInsuranceTerm] = useState(null)
    const [policeStartDate, setPoliceStartDate] = useState(dayjs())
    const [oked, setOked] = useState(null)
    const [fotSum, setFotSum] = useState(0)
    const [risk, setRisk] = useState(null)
    const [insurancePremium, setInsurancePremium] = useState(0)
    const [rpmPercent, setRpmPercent] = useState(5)
    const [rewardPercent, setRewardPercent] = useState(25)
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const {t} = useTranslation()
    const navigate = useNavigate();
    const breadcrumbs = useMemo(() => [{
        id: 1, title: 'OSGOR', path: '/osgor/list',
    }, {
        id: 2, title: 'Добавить OSGOR', path: '/osgor/create',
    }], [])


    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const {data, isLoading} = useGetAllQuery({
        key: KEYS.osgorView,
        url: URLS.osgorView,
        params: {
            params: {
                osgor_formId: form_id
            }
        },
        enabled: !!(form_id)
    })

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

    const {data: genders} = useGetAllQuery({
        key: KEYS.genders, url: URLS.genders
    })
    const genderList = getSelectOptionsListFromData(get(genders, `data.result`, []), 'id', 'name')

    const {data: residentTypes} = useGetAllQuery({
        key: KEYS.residentTypes, url: URLS.residentTypes
    })
    const residentTypeList = getSelectOptionsListFromData(get(residentTypes, `data.result`, []), 'id', 'name')

    const {data: okeds} = useGetAllQuery({
        key: KEYS.okeds, url: URLS.okeds
    })
    const okedList = getSelectOptionsListFromData(get(okeds, `data.result`, []), 'id', 'name')

    const {data: ownershipForms} = useGetAllQuery({
        key: KEYS.ownershipForms, url: URLS.ownershipForms
    })
    const ownershipFormList = getSelectOptionsListFromData(get(ownershipForms, `data.result`, []), 'id', 'name')

    const {data: areaTypes} = useGetAllQuery({
        key: KEYS.areaTypes, url: URLS.areaTypes
    })
    const areaTypesList = getSelectOptionsListFromData(get(areaTypes, `data.result`, []), 'id', 'name')

    const {data: district} = useGetAllQuery({
        key: [KEYS.districts, regionId],
        url: URLS.districts,
        params: {
            params: {
                region: regionId
            }
        },
        enabled: !!(regionId || get(person, 'regionId'))
    })
    const districtList = getSelectOptionsListFromData(get(district, `data.result`, []), 'id', 'name')

    const {data: activity} = useGetAllQuery({
        key: [KEYS.activityAndRisk, oked],
        url: URLS.activityAndRisk,
        params: {
            params: {
                oked
            }
        },
        enabled: !!(oked)
    })

    const {data: agents} = useGetAllQuery({
        key: [KEYS.agents, agencyId],
        url: URLS.agents,
        params: {
            params: {
                branch: agencyId
            }
        },
        enabled: !!(agencyId)
    })
    const agentsList = getSelectOptionsListFromData(get(agents, `data.result`, []), 'id', 'name')
    const activityList = getSelectOptionsListFromData([{
        oked: get(activity, `data.result.oked`),
        name: get(activity, `data.result.name`)
    }], 'oked', 'name')

    const {
        mutate: getPersonalInfoRequest, isLoading: isLoadingPersonalInfo
    } = usePostQuery({listKeyId: KEYS.personalInfoProvider})

    const {
        mutate: getOrganizationInfoRequest, isLoading: isLoadingOrganizationInfo
    } = usePostQuery({listKeyId: KEYS.organizationInfoProvider})

    const {
        mutate: calculatePremiumRequest
    } = usePostQuery({listKeyId: KEYS.osgorCalculate,hideSuccessToast:true})
    const {
        mutate: updateRequest,isLoading:isLoadingPatch
    } = usePutQuery({listKeyId: KEYS.osgorEdit})

    const getInfo = () => {
        getPersonalInfoRequest({
                url: URLS.personalInfoProvider, attributes: {
                    birthDate: dayjs(birthDate).format('YYYY-MM-DD'), passportSeries, passportNumber
                }
            },
            {
                onSuccess: ({data}) => {
                    setPerson(get(data, 'result'))
                }
            }
        )
    }
    const getOrgInfo = () => {
        getOrganizationInfoRequest({
                url: URLS.organizationInfoProvider, attributes: {
                    inn
                }
            },
            {
                onSuccess: ({data}) => {
                    setOrganization(get(data, 'result'))
                }
            }
        )
    }
    const calculatePremium = () => {
        calculatePremiumRequest({
                url: URLS.osgorCalculate, attributes: {
                    risk,
                    insuranceSum: fotSum,
                    insuranceTermId:insuranceTerm
                }
            },
            {
                onSuccess: ({data}) => {
                    setInsurancePremium(get(data, 'result.insurancePremium'))
                }
            }
        )
    }
    const getFieldData = (name, value) => {
        if (isEqual(name, 'insurant.person.regionId')) {
            setRegionId(value)
        }
        if (isEqual(name, 'policies[0].insuranceTermId')) {
            setInsuranceTerm(value)
        }
        if (isEqual(name, 'insurant.organization.oked') || isEqual(name, 'insurant.person.oked')) {
            setOked(value)
        }
        if (isEqual(name, 'policies[0].risk')) {
            setRisk(value)
        }
        if (isEqual(name, 'policies[0].rpm')) {
            setRpmPercent(value)
        }
        if (isEqual(name, 'policies[0].agentReward')) {
            setRewardPercent(value)
        }
        if (isEqual(name, 'agencyId')) {
            setAgencyId(value)
        }
        if (isEqual(name, 'agentId')) {
            setAgentId(value)
        }
    }
    const update = ({data}) => {
        const {
            activityRisk,
            birthDate,
            fot,
            funeralExpensesSum,
            passportNumber,
            passportSeries,
            rewardPercent,
            rewardSum,
            risk,
            rpmPercent,
            rpmSum,
            policies,
            agentId,
            insurant: insurantType,
            ...rest
        } = data
        updateRequest({
                url: URLS.osgorEdit, attributes: {
                    agentId:String(agentId),
                    regionId: isEqual(insurant, 'person') ? get(insurantType, 'person.regionId') : get(insurantType, 'organization.regionId'),
                    sum: get(head(policies), 'insuranceSum', 0),
                    contractStartDate: get(head(policies), 'startDate'),
                    contractEndDate: get(head(policies), 'endDate'),
                    insurant: isEqual(insurant, 'person') ? {
                        person: {
                            passportData: get(insurantType, 'person.passportData'),
                            fullName: get(insurantType, 'person.fullName'),
                            regionId: get(insurantType, 'person.regionId'),
                            gender: get(insurantType, 'person.gender'),
                            birthDate: get(insurantType, 'person.birthDate'),
                            address: get(insurantType, 'person.address'),
                            residentType: get(insurantType, 'person.residentType'),
                            countryId: get(insurantType, 'person.countryId'),
                            phone: get(insurantType, 'person.phone'),
                            email: isEmpty(get(insurantType, 'person.email')) ? undefined :get(insurantType, 'person.email'),
                            oked: String(get(insurantType, 'person.oked')),
                        }
                    } : {
                        organization: {
                            ...get(insurantType, 'organization'),
                            oked: String(get(insurantType, 'organization.oked')),
                            email: isEmpty(get(insurantType, 'organization.email')) ? undefined :get(insurantType, 'organization.email'),
                        }
                    },
                    policies: [
                        {
                            ...head(policies),
                            insuranceRate: get(data, 'comission', 0),
                            fot: fotSum,
                            funeralExpensesSum: parseInt(funeralExpensesSum),
                            agentReward:parseInt(get(head(policies), 'agentReward',0)),
                            risk:parseInt(get(head(policies), 'risk',0))
                        }
                    ],
                    ...rest,
                    osgor_formId: parseInt(form_id)
                }
            },
            {
                onSuccess: ({data: response}) => {
                    if (get(response, 'result.osgor_formId')) {
                        navigate(`/osgor/view/${get(response, 'result.osgor_formId')}`);
                    } else {
                        navigate(`/osgor`);
                    }
                },
            }
        )
    }
    useEffect(() => {
        if (risk && fotSum && insuranceTerm) {
            calculatePremium()
        }
    }, [risk, fotSum,insuranceTerm])
    useEffect(() => {
        if (get(data, 'data.result.insurant.organization.oked')) {
            setOked(get(data, 'data.result.insurant.organization.oked'))
        }
        if (get(data, 'data.result.insurant.person.oked')) {
            setOked(get(data, 'data.result.insurant.person.oked'))
        }
        if (get(data, 'data.result.policies[0].fot')) {
            setFotSum(get(data, 'data.result.policies[0].fot'))
        }
        if (get(data, 'data.result.policies[0].insurancePremium')) {
            setInsurancePremium(get(data, 'data.result.policies[0].insurancePremium'))
        }
        if (get(data, 'data.result.insurant.organization')) {
            setInsurant('organization')
            setOrganization(get(data, 'data.result.insurant.organization'))
        }
        if (get(data, 'data.result.insurant.person')) {
            setInsurant('person')
            setOrganization(get(data, 'data.result.insurant.person'))
        }
        if (get(data, 'data.result.agencyId')) {
            setAgencyId(get(data, 'data.result.agencyId'))
        }
        if (get(data, 'data.result.insurant.organization.inn')) {
            setInn(get(data, 'data.result.insurant.organization.inn'))
        }
        if (!isNil(get(data, 'data.result.policies[0].agentReward'))) {
            setRewardPercent(get(data, 'data.result.policies[0].agentReward'))
        }

    }, [get(data, 'data.result')])


    if (isLoadingFilials || isLoadingInsuranceTerms || isLoadingCountry || isLoadingRegion || isLoading) {
        return <OverlayLoader/>
    }

    return (<>
        {(isLoadingPersonalInfo || isLoadingOrganizationInfo,isLoadingPatch) && <OverlayLoader/>}
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
                    <Form formRequest={update} getValueFromField={(value, name) => getFieldData(name, value)}
                          footer={<Flex className={'mt-32'}><Button onClick={() => navigate('/osgor')} type={'button'}
                                                                    gray className={'mr-16'}>Назад</Button><Button
                              type={'submit'}
                              className={'mr-16'}>Сохранить</Button></Flex>}>
                        <Row gutterWidth={60} className={'mt-32'}>
                            <Col xs={4} style={{borderRight: '1px solid #DFDFDF'}}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Статус</Col>
                                    <Col xs={7}><Button green>{get(data, 'data.result.status')}</Button></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Филиал </Col>
                                    <Col xs={7}><Field disabled defaultValue={get(data, 'data.result.agencyId')}
                                                       params={{required: true}} options={filialList}
                                                       property={{hideLabel: true}} type={'select'}
                                                       name={'agencyId'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Серия договора:</Col>
                                    <Col xs={7}><Field defaultValue={get(data, 'data.result.seria')}
                                                       property={{hideLabel: true}} type={'input'}
                                                       name={'seria'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Номер договора: </Col>
                                    <Col xs={7}><Field defaultValue={get(data, 'data.result.number')}
                                                       params={{required: true}} property={{hideLabel: true}}
                                                       type={'input'}
                                                       name={'number'}/></Col>
                                </Row>


                                {/*<Row align={'center'} className={'mb-25'}>*/}
                                {/*    <Col xs={6} className={'text-center'}>*/}
                                {/*        <img src={qrcodeImg} alt=""/>*/}
                                {/*    </Col>*/}
                                {/*    <Col xs={6}>*/}
                                {/*        <Button type={'button'}>Проверить полис</Button>*/}
                                {/*    </Col>*/}
                                {/*</Row>*/}
                            </Col>
                            <Col xs={4}>

                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Страховая сумма: </Col>
                                    <Col xs={7}><Field defaultValue={fotSum}
                                                       property={{hideLabel: true, disabled: true}}
                                                       type={'number-format-input'}
                                                       name={'policies[0].insuranceSum'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Страховая премия: </Col>
                                    <Col xs={7}><Field defaultValue={insurancePremium}
                                                       property={{hideLabel: true, disabled: true}}
                                                       type={'number-format-input'}
                                                       name={'policies[0].insurancePremium'}/></Col>
                                </Row>


                            </Col>
                            <Col xs={4}>

                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Срок страхования:</Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.result.policies[0].insuranceTermId')}
                                        options={insuranceTermsList} params={{required: true}}
                                        label={'Insurance term'} property={{hideLabel: true}}
                                        type={'select'}
                                        name={'policies[0].insuranceTermId'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Дата начала покрытия: </Col>
                                    <Col xs={7}><Field
                                        property={{
                                            hideLabel: true,
                                            onChange: (val) => setPoliceStartDate(val),
                                            dateFormat: 'dd.MM.yyyy'
                                        }}
                                        type={'datepicker'}
                                        name={'policies[0].startDate'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Дача окончания покрытия: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={getEndDateByInsuranceTerm(find(get(insuranceTerms, `data.result`, []), (_insuranceTerm) => get(_insuranceTerm, 'id') == insuranceTerm), policeStartDate)}
                                        disabled={!isEqual(insuranceTerm, 6)}
                                        property={{hideLabel: true, dateFormat: 'dd.MM.yyyy'}} type={'datepicker'}
                                        name={'policies[0].endDate'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Дата выдачи полиса: </Col>
                                    <Col xs={7}><Field property={{hideLabel: true, dateFormat: 'dd.MM.yyyy'}}
                                                       type={'datepicker'}
                                                       name={'policies[0].issueDate'}/></Col>
                                </Row>
                            </Col>
                        </Row>


                        <Row gutterWidth={60} className={'mt-15'}>
                            <Col xs={12} className={'mb-15'}><Title>Страхователь</Title></Col>
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
                                            <Field
                                                defaultValue={get(data,'data.result.insurant.person.passportData.seria')}
                                                className={'mr-16'} style={{width: 75}}
                                                property={{
                                                    hideLabel: true,
                                                    mask: 'aa',
                                                    placeholder: 'AA',
                                                    upperCase: true,
                                                    maskChar: '_',
                                                    onChange: (val) => setPassportSeries(upperCase(val))
                                                }}
                                                name={'passportSeries'}
                                                type={'input-mask'}
                                            />
                                            <Field
                                                defaultValue={get(data,'data.result.insurant.person.passportData.number')}
                                                property={{
                                                hideLabel: true,
                                                mask: '9999999',
                                                placeholder: '1234567',
                                                maskChar: '_',
                                                onChange: (val) => setPassportNumber(val)
                                            }} name={'passportNumber'} type={'input-mask'}/>

                                            <Field
                                                defaultValue={get(data,'data.result.insurant.person.birthDate')}
                                                className={'ml-15'}
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
                                            <Field defaultValue={get(data,'data.result.insurant.organization.inn')} property={{
                                                hideLabel: true,
                                                mask: '999999999',
                                                placeholder: 'Inn',
                                                maskChar: '_',
                                                onChange: (val) => setInn(val)
                                            }} name={'inn'} type={'input-mask'}/>
                                            <Button onClick={getOrgInfo} className={'ml-15'} type={'button'}>Получить
                                                данные</Button>
                                        </Flex>}
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={12}>
                                <hr className={'mt-15 mb-15'}/>
                            </Col>
                            {isEqual(insurant, 'person') && <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(person, 'firstNameLatin',get(data,'data.result.insurant.person.fullName.firstname'))}
                                           label={'Firstname'}
                                           type={'input'}
                                           name={'insurant.person.fullName.firstname'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(person, 'lastNameLatin',get(data,'data.result.insurant.person.fullName.lastname'))}
                                           label={'Lastname'} type={'input'}
                                           name={'insurant.person.fullName.lastname'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(person, 'middleNameLatin',get(data,'data.result.insurant.person.fullName.middlename'))}
                                           label={'Middlename'}
                                           type={'input'}
                                           name={'insurant.person.fullName.middlename'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(person, 'pinfl',get(data,'data.result.insurant.person.passportData.pinfl'))} label={'ПИНФЛ'} type={'input'}
                                           name={'insurant.person.passportData.pinfl'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} property={{
                                        mask: 'aa',
                                        placeholder: 'AA',
                                        maskChar: '_'
                                    }} defaultValue={passportSeries ?? get(data,'data.result.insurant.person.passportData.seria')} label={'Passport seria'} type={'input-mask'}
                                           name={'insurant.person.passportData.seria'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} property={{
                                        mask: '9999999',
                                        placeholder: '1234567',
                                        maskChar: '_'
                                    }} defaultValue={passportNumber??get(data,'data.result.insurant.person.passportData.number')} label={'Passport number'} type={'input-mask'}
                                           name={'insurant.person.passportData.number'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={dayjs(get(person, 'birthDate',get(data,'data.result.insurant.person.birthDate'))).toDate()}
                                           label={'Birth date'}
                                           type={'datepicker'}
                                           name={'insurant.person.birthDate'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(person, 'gender',get(data,'data.result.insurant.person.gender'))}
                                           options={genderList}
                                           label={'Gender'}
                                           type={'select'}
                                           name={'insurant.person.gender'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        options={countryList}
                                        defaultValue={get(person, 'birthCountry',get(data,'data.result.insurant.person.countryId'))}
                                        label={'Country'}
                                        type={'select'}
                                        name={'insurant.person.countryId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        options={regionList}
                                        defaultValue={get(person, 'regionId',get(data,'data.result.insurant.person.regionId'))}
                                        label={'Region'}
                                        type={'select'}
                                        name={'insurant.person.regionId'}/>
                                </Col>
                                {/*<Col xs={3} className={'mb-25'}>*/}
                                {/*    <Field*/}
                                {/*        options={districtList}*/}
                                {/*        defaultValue={get(person, 'districtId',get(data,'data.result.insurant.person.districtId'))}*/}
                                {/*        label={'District'}*/}
                                {/*        type={'select'}*/}
                                {/*        name={'insurant.person.districtId'}/>*/}
                                {/*</Col>*/}
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={areaTypesList}
                                        defaultValue={get(person, 'areaTypeId',get(data,'data.result.areaTypeId'))}
                                        label={'Тип местности'}
                                        type={'select'}
                                        name={'areaTypeId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           options={residentTypeList}
                                           defaultValue={get(person, 'residentType',get(data,'data.result.insurant.person.residentType'))}
                                           label={'Resident type'}
                                           type={'select'}
                                           name={'insurant.person.residentType'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(person, 'address',get(data,'data.result.insurant.person.address'))}
                                           label={'Address'}
                                           type={'input'}
                                           name={'insurant.person.address'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{
                                            required: true,
                                            pattern: {
                                                value: /^998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/,
                                                message: 'Invalid format'
                                            }
                                        }}
                                        defaultValue={get(person, 'phone',get(data,'data.result.insurant.person.phone'))}
                                        label={'Phone'}
                                        type={'input'}
                                        property={{placeholder: '998XXXXXXXXX'}}
                                        name={'insurant.person.phone'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(person, 'email',get(data,'data.result.insurant.person.email'))}
                                        label={'Email'}
                                        type={'input'}
                                        name={'insurant.person.email'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(data,'data.result.insurant.person.oked')}
                                        options={okedList}
                                        params={{required: true}}
                                        label={'Oked'}
                                        type={'select'}
                                        name={'insurant.person.oked'}/>
                                </Col>
                            </>}
                            {isEqual(insurant, 'organization') && <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} label={'INN'} defaultValue={inn ?? get(data,'data.result.insurant.organization.inn')} property={{
                                        mask: '999999999',
                                        placeholder: 'Inn',
                                        maskChar: '_'
                                    }} name={'insurant.organization.inn'} type={'input-mask'}/>

                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(organization, 'name')}
                                           label={'Наименование'} type={'input'}
                                           name={'insurant.organization.name'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(data,'data.result.insurant.organization.representativeName')} label={'Руководитель'} type={'input'}
                                           name={'insurant.organization.representativeName'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(data,'data.result.insurant.organization.position')} label={'Должность'} type={'input'}
                                           name={'insurant.organization.position'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={areaTypesList}
                                        defaultValue={get(data,'data.result.areaTypeId')}
                                        label={'Тип местности'}
                                        type={'select'}
                                        name={'areaTypeId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(organization, 'address')} params={{required: true}} label={'Address'} type={'input'}
                                           name={'insurant.organization.address'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(organization, 'phone')} params={{
                                        required: true,
                                        pattern: {value:/^998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/,message: 'Invalid format'}
                                    }}
                                           label={'Телефон'} type={'input'}
                                           name={'insurant.organization.phone'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(organization, 'email')} label={'Email'} type={'input'}
                                           name={'insurant.organization.email'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           options={okedList}
                                           defaultValue={get(organization, 'oked')}
                                           label={'ОКЭД'}
                                           type={'select'}
                                           name={'insurant.organization.oked'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(data,'data.result.insurant.organization.checkingAccount')} label={'Расчетный счет'} type={'input'}
                                           name={'insurant.organization.checkingAccount'}/>
                                </Col>
                                <Col xs={3}><Field defaultValue={get(data,'data.result.insurant.organization.regionId')} label={'Область'} params={{required: true}} options={regionList}
                                                   type={'select'}
                                                   name={'insurant.organization.regionId'}/></Col>
                                <Col xs={3}><Field defaultValue={get(data,'data.result.insurant.organization.ownershipFormId')} label={'Форма собственности'} params={{required: true}}
                                                   options={ownershipFormList}
                                                   type={'select'}
                                                   name={'insurant.organization.ownershipFormId'}/></Col>
                            </>}
                        </Row>
                        <Row gutterWidth={60} className={'mt-15'}>
                            <Col xs={12} className={'mb-15'}><Title>Вид деятельности</Title></Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    defaultValue={get(head(activityList),'value')}
                                    options={activityList}
                                    label={'Вид деятельности (по правилам)'}
                                    type={'select'}
                                    name={'activityRisk'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    defaultValue={get(data, 'data.result.policies[0].risk')}
                                    options={getSelectOptionsListFromData(get(activity, 'data.result.risks', []), 'number', 'number')}
                                    label={'Класс проф. риска'}
                                    type={'select'}
                                    name={'policies[0].risk'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    defaultValue={get(find(get(activity, 'data.result.risks', []), _risk => get(_risk, 'number') == risk), 'coeficient') ?? get(data, 'data.result.policies[0].insuranceRate',0)}
                                    property={{disabled: true}}
                                    label={'Коэффициент страхового тарифа'}
                                    type={'input'}
                                    name={'comission'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    defaultValue={get(data, 'data.result.policies[0].funeralExpensesSum',0)}
                                    label={'Расходы на погребение'}
                                    type={'number-format-input'}
                                    name={'funeralExpensesSum'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    defaultValue={get(data, 'data.result.policies[0].fot',0)}
                                    property={{onChange: (val) => setFotSum(val)}}
                                    label={'Фонд оплаты труда'}
                                    type={'number-format-input'}
                                    name={'fot'}/>
                            </Col>
                        </Row>
                        <Row gutterWidth={60} className={'mt-15'}>
                            <Col xs={12} className={'mb-15'}><Title>Агентсткое вознограждение и РПМ</Title></Col>
                            <Col xs={8}>
                                <Row>
                                    <Col xs={12} className={'mb-25'}>
                                        <Field
                                            defaultValue={get(data, 'data.result.agentId')}
                                            options={[...agentsList]}
                                            label={'Агент'}
                                            type={'select'}
                                            name={'agentId'}/>
                                    </Col>

                                    <Col xs={6} className={'mb-25'}>
                                        <Field
                                            defaultValue={isEqual(agentId,'0') ? 0 : get(data,'data.result.policies[0].agentReward',25)}
                                            label={'Вознограждение %'}
                                            property={{type:'number',disabled:isEqual(agentId,'0')}}
                                            type={'input'}
                                            name={'policies[0].agentReward'}/>
                                    </Col>
                                    <Col xs={6} className={'mb-25'}>
                                        <Field
                                            defaultValue={5}
                                            property={{disabled:true}}
                                            label={'Отчисления в РПМ  %'}
                                            type={'input'}
                                            name={'policies[0].rpm'}/>
                                    </Col>
                                    <Col xs={6} className={'mb-25'}>
                                        <Field
                                            defaultValue={round(rewardPercent * insurancePremium / 100, 2)}
                                            property={{disabled: true}}
                                            label={'Сумма'}
                                            type={'number-format-input'}
                                            name={'rewardSum'}/>
                                    </Col>
                                    <Col xs={6} className={'mb-25'}>
                                        <Field
                                            defaultValue={round(rpmPercent * insurancePremium / 100, 2)}
                                            property={{disabled: true}}
                                            label={'Сумма'}
                                            type={'number-format-input'}
                                            name={'rpmSum'}/>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Section>
    </>);
};

export default UpdateContainer;