import React, {useEffect, useMemo, useState} from 'react';
import {useSettingsStore, useStore} from "../../../../store";
import {find, get, head, isEqual, isNil, round} from "lodash";
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

const getEndDateByInsuranceTerm = (term, startDate) => {
    if (!isNil(term)) {
        return dayjs(startDate).add(get(term, 'value'), get(term, 'prefix')).toDate()
    }
    return dayjs()
}

const UpdateContainer = ({form_id}) => {
    const [person, setPerson] = useState(null)
    const [organization, setOrganization] = useState(null)
    const [insurant, setInsurant] = useState('person')
    const [passportSeries, setPassportSeries] = useState(null)
    const [passportNumber, setPassportNumber] = useState(null)
    const [birthDate, setBirthDate] = useState(null)
    const [inn, setInn] = useState(null)
    const [regionId, setRegionId] = useState(null)
    const [insuranceTerm, setInsuranceTerm] = useState(null)
    const [policeStartDate, setPoliceStartDate] = useState(dayjs())
    const [oked, setOked] = useState(null)
    const [fotSum, setFotSum] = useState(0)
    const [risk, setRisk] = useState(null)
    const [insurancePremium, setInsurancePremium] = useState(0)
    const [rpmPercent, setRpmPercent] = useState(0)
    const [rewardPercent, setRewardPercent] = useState(0)
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
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
                    insuranceSum: fotSum
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
        if (isEqual(name, 'insurant.organization.oked')) {
            setOked(value)
        }
        if (isEqual(name, 'risk')) {
            setRisk(value)
        }
        if (isEqual(name, 'rpmPercent')) {
            setRpmPercent(value)
        }
        if (isEqual(name, 'rewardPercent')) {
            setRewardPercent(value)
        }
        if (isEqual(name, 'insurant.person.oked')) {
            if (value?.length >= 4) {
                setOked(value)
            }
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
            insurant: insurantType,
            ...rest
        } = data
        updateRequest({
                url: URLS.osgorEdit, attributes: {
                    sum: get(head(policies), 'insuranceSum', 0),
                    contractStartDate: get(head(policies), 'startDate'),
                    contractEndDate: get(head(policies), 'endDate'),
                    policies: [
                        {
                            ...head(policies),
                            insuranceRate: get(data, 'comission'),
                            fot: fotSum,
                            funeralExpensesSum: parseInt(funeralExpensesSum)
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
        if (risk && fotSum) {
            calculatePremium()
        }
    }, [risk, fotSum])
    useEffect(() => {
        if (get(data, 'data.result.insurant.organization.oked')) {
            setOked(get(data, 'data.result.insurant.organization.oked'))
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
                                    <Col xs={7}><Field defaultValue={get(data, 'data.result.agencyId')}
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
                                            dateFormat: 'yyyy-MM-dd'
                                        }}
                                        type={'datepicker'}
                                        name={'policies[0].startDate'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Дача окончания покрытия: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={getEndDateByInsuranceTerm(find(get(insuranceTerms, `data.result`, []), (_insuranceTerm) => get(_insuranceTerm, 'id') == insuranceTerm), policeStartDate)}
                                        disabled={!isEqual(insuranceTerm, 6)}
                                        property={{hideLabel: true, dateFormat: 'yyyy-MM-dd'}} type={'datepicker'}
                                        name={'policies[0].endDate'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Дата выдачи полиса: </Col>
                                    <Col xs={7}><Field property={{hideLabel: true, dateFormat: 'yyyy-MM-dd'}}
                                                       type={'datepicker'}
                                                       name={'policies[0].issueDate'}/></Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row gutterWidth={60} className={'mt-15'}>
                            <Col xs={12} className={'mb-15'}><Title>Вид деятельности</Title></Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    options={activityList}
                                    label={'Вид деятельности (по правилам)'}
                                    type={'select'}
                                    name={'activityRisk'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    options={getSelectOptionsListFromData(get(activity, 'data.result.risks', []), 'number', 'number')}
                                    label={'Класс проф. риска'}
                                    type={'select'}
                                    name={'risk'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    defaultValue={get(find(get(activity, 'data.result.risks', []), _risk => get(_risk, 'number') == risk), 'coeficient')}
                                    property={{disabled: true}}
                                    label={'Коэффициент страхового тарифа'}
                                    type={'input'}
                                    name={'comission'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    label={'Расходы на погребение'}
                                    type={'input'}
                                    name={'funeralExpensesSum'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
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
                                            options={filialList}
                                            label={'Агент'}
                                            type={'select'}
                                            name={'agencyId'}/>
                                    </Col>

                                    <Col xs={6} className={'mb-25'}>
                                        <Field
                                            label={'Вознограждение %'}
                                            type={'input'}
                                            name={'rewardPercent'}/>
                                    </Col>
                                    <Col xs={6} className={'mb-25'}>
                                        <Field
                                            label={'Отчисления в РПМ  %'}
                                            type={'input'}
                                            name={'rpmPercent'}/>
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