import React, {useEffect, useMemo, useState} from 'react';
import {useStore} from "../../../../store";
import {find, get, every, isEqual, isNil, round, upperCase, values, isEmpty, sumBy, includes} from "lodash";
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
import dayjs from "dayjs";
import {toast} from "react-toastify";
import Checkbox from 'rc-checkbox';
import Modal from "../../../../components/modal";
import Table from "../../../../components/table";
import {Trash2} from "react-feather";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import NumberFormat from "react-number-format";

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

const CreateContainer = () => {
    const [owner, setOwner] = useState('person')
    const [ownerPerson, setOwnerPerson] = useState(null)
    const [ownerOrganization, setOwnerOrganization] = useState(null)
    const [insurant, setInsurant] = useState('person')
    const [insurantPerson, setInsurantPerson] = useState(null)
    const [insurantOrganization, setInsurantOrganization] = useState(null)
    const [vehicle, setVehicle] = useState(null)
    const [passportSeries, setPassportSeries] = useState(null)
    const [passportNumber, setPassportNumber] = useState(null)
    const [birthDate, setBirthDate] = useState(null)
    const [insurantPassportSeries, setInsurantPassportSeries] = useState(null)
    const [insurantPassportNumber, setInsurantPassportNumber] = useState(null)
    const [insurantBirthDate, setInsurantBirthDate] = useState(null)
    const [inn, setInn] = useState(null)
    const [insurantInn, setInsurantInn] = useState(null)
    const [insuranceTerm, setInsuranceTerm] = useState(null)
    const [policeStartDate, setPoliceStartDate] = useState(dayjs())
    const [rpmPercent, setRpmPercent] = useState(0)
    const [rewardPercent, setRewardPercent] = useState(0)
    const [govNumber, setGovNumber] = useState(null)
    const [techPassportSeria, setTechPassportSeria] = useState(null)
    const [techPassportNumber, setTechPassportNumber] = useState(null)
    const [insurantIsOwner, setInsuranttIsOwner] = useState(false)
    const [visible, setVisible] = useState(false)
    const [lastYearPayment, setlastYearPayment] = useState(0)
    const [lastYearInsurancePremium, setLastYearInsurancePremium] = useState(0)
    const [ratioResponse, setRatioResponse] = useState({})
    const [agencyId, setAgencyId] = useState(null)
    const [agentId, setAgentId] = useState(null)
    const [regionId, setRegionId] = useState(null)
    const [otherPrams, setOtherParams] = useState({})
    const [idList, setIdList] = useState([])
    const [osgopCalculateData, setOsgopCalculateData] = useState({
        insuranceSumForPassenger: 0,
        passengerCapacity: 0,
        vehicleTypeId: 0,
        lossRatio: 0
    })
    const [osgopCalculateResponse, setOsgopCalculateResponse] = useState({})
    const [policies, setPolicies] = useState([])

    const navigate = useNavigate();
    const {t} = useTranslation()

    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [{
        id: 1, title: 'OSGOP', path: '/osgop',
    }, {
        id: 2, title: 'Добавить OSGOP', path: '/osgop/create',
    }], [])
    const user = useStore((state) => get(state, 'user'))


    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const {data: filials} = useGetAllQuery({key: KEYS.agencies, url: URLS.agencies})
    const filialList = getSelectOptionsListFromData(get(filials, `data.result`, []), 'id', 'name')

    const {data: insuranceTerms, isLoading: isLoadingInsuranceTerms} = useGetAllQuery({
        key: KEYS.insuranceTerms, url: URLS.insuranceTerms
    })
    const insuranceTermsList = getSelectOptionsListFromData(get(insuranceTerms, `data.result`, []), 'id', 'name')


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


    const {data: vehicleTypes} = useGetAllQuery({
        key: KEYS.vehicleTypes, url: URLS.vehicleTypes
    })
    const vehicleTypeList = getSelectOptionsListFromData(get(vehicleTypes, `data.result`, []), 'id', 'name')

    const {data: ownershipForms} = useGetAllQuery({
        key: KEYS.ownershipForms, url: URLS.ownershipForms
    })
    const ownershipFormList = getSelectOptionsListFromData(get(ownershipForms, `data.result`, []), 'id', 'name')


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

    const {data: country, isLoading: isLoadingCountry} = useGetAllQuery({
        key: KEYS.countries, url: URLS.countries
    })
    const countryList = getSelectOptionsListFromData(get(country, `data.result`, []), 'id', 'name')

    const {data: okeds} = useGetAllQuery({
        key: KEYS.okeds, url: URLS.okeds
    })
    const okedList = getSelectOptionsListFromData(get(okeds, `data.result`, []), 'id', 'name')

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
        enabled: !!(regionId || get(ownerPerson, 'regionId'))
    })
    const districtList = getSelectOptionsListFromData(get(district, `data.result`, []), 'id', 'name')
    const {
        mutate: getPersonalInfoRequest, isLoading: isLoadingPersonalInfo
    } = usePostQuery({listKeyId: KEYS.personalInfoProvider})

    const {
        mutate: getOrganizationInfoRequest, isLoading: isLoadingOrganizationInfo
    } = usePostQuery({listKeyId: KEYS.organizationInfoProvider})

    const {
        mutate: getVehicleInfoRequest, isLoading: isLoadingVehicleInfo
    } = usePostQuery({listKeyId: KEYS.vehicleInfoProvider})

    const {
        mutate: getRatioRequest
    } = usePostQuery({listKeyId: KEYS.getRatio, hideSuccessToast: true})
    const {
        mutate: calcRequest
    } = usePostQuery({listKeyId: KEYS.osgopCalculate, hideSuccessToast: true})

    const {
        mutate: createRequest, isLoading: isLoadingPost
    } = usePostQuery({listKeyId: KEYS.osgopCreate})

    const getInfo = (type = 'owner') => {
        getPersonalInfoRequest({
                url: URLS.personalInfoProvider, attributes: type == 'insurant' ? {
                    birthDate: dayjs(insurantBirthDate).format('YYYY-MM-DD'),
                    passportSeries: insurantPassportSeries,
                    passportNumber: insurantPassportNumber
                } : {
                    birthDate: dayjs(birthDate).format('YYYY-MM-DD'), passportSeries, passportNumber
                }
            },
            {
                onSuccess: ({data}) => {
                    if (type == 'owner') {
                        setOwnerPerson(get(data, 'result'));
                    }
                    if (type == 'insurant') {
                        setInsurantPerson(get(data, 'result'));
                    }
                }
            }
        )
    }

    const getOrgInfo = (type = 'owner') => {
        getOrganizationInfoRequest({
                url: URLS.organizationInfoProvider, attributes: type == 'insurant' ? {
                    inn: insurantInn
                } : {
                    inn: inn
                }
            },
            {
                onSuccess: ({data}) => {
                    if (type == 'owner') {
                        setOwnerOrganization(get(data, 'result'))
                    }
                    if (type == 'insurant') {
                        setInsurantOrganization(get(data, 'result'))
                    }
                }
            }
        )
    }

    const getVehicleInfo = () => {
        if (govNumber && techPassportNumber && techPassportSeria) {
            getVehicleInfoRequest({
                    url: URLS.vehicleInfoProvider, attributes: {
                        govNumber,
                        techPassportNumber,
                        techPassportSeria
                    }
                },
                {
                    onSuccess: ({data}) => {
                        setVehicle(get(data, 'result'))
                    }
                }
            )
        } else {
            toast.warn('Please fill all fields')
        }
    }

    const calculatePremium = () => {
        calcRequest({
                url: URLS.osgopCalculate, attributes: osgopCalculateData
            },
            {
                onSuccess: ({data}) => {
                    setOsgopCalculateResponse(get(data, 'result'))
                }
            }
        )
    }

    const getRatio = () => {
        getRatioRequest({
                url: URLS.getRatio, attributes: {
                    lastYearPayment,
                    lastYearInsurancePremium
                }
            },
            {
                onSuccess: ({data}) => {
                    setRatioResponse(get(data, 'result'))
                }
            }
        )
    }

    const getFieldData = (name, value) => {
        if (isEqual(name, 'terms')) {
            setInsuranceTerm(value)
        }
        if (isEqual(name, 'insurant.person.regionId')) {
            setRegionId(value)
        }
        if (isEqual(name, 'insurant.organization.regionId')) {
            setRegionId(value)
        }
        if (isEqual(name, 'owner.organization.regionId')) {
            setRegionId(value)
        }
        if (isEqual(name, 'owner.person.regionId')) {
            setRegionId(value)
        }
        if (isEqual(name, 'rpm')) {
            setRpmPercent(value)
        }
        if (isEqual(name, 'agentReward')) {
            setRewardPercent(value)
        }
        if (isEqual(name, 'agencyId')) {
            setAgencyId(value)
        }
        if (isEqual(name, 'agentId')) {
            setAgentId(value)
        }
        if (isEqual(name, 'insuranceTermId')) {
            setInsuranceTerm(value)
        }
        if (isEqual(name, 'lastYearPayment')) {
            setlastYearPayment(value)
        }
        if (isEqual(name, 'lastYearInsurancePremium')) {
            setLastYearInsurancePremium(value)
        }
        if (isEqual(name, 'insuranceSumForPassenger')) {
            setOsgopCalculateData(prev => ({...prev, insuranceSumForPassenger: parseInt(value)}))
        }
        if (isEqual(name, 'passengerCapacity')) {
            setOsgopCalculateData(prev => ({...prev, passengerCapacity: parseInt(value)}))
        }
        if (isEqual(name, 'vehicle.objects[0].vehicle.vehicleTypeId')) {
            setOsgopCalculateData(prev => ({...prev, vehicleTypeId: parseInt(value)}))
        }
        if (isEqual(name, 'lossRatio')) {
            setOsgopCalculateData(prev => ({...prev, lossRatio: parseInt(value)}))
        }
        setOtherParams(prev => ({...prev, [name]: value}))
    }

    const create = ({data}) => {
        const {
            insuranceSumForPassenger,
            passengerCapacity,
            birthDate,
            passportNumber,
            passportSeries,
            insurantPassportSeries,
            insurantPassportNumber,
            insurantBirthDate,
            rpmSum,
            inn,
            agentReward,
            insurantInn,
            insurant: insurantType,
            owner: ownerType,
            ...rest
        } = data
        createRequest({
                url: URLS.osgopCreate, attributes: {
                    agentReward:Number(agentReward),
                    regionId: isEqual(insurantIsOwner ? owner : insurant, 'person') ? get(insurantType, 'person.regionId') : get(insurantType, 'organization.regionId'),
                    insurantIsOwner,
                    insurant: isEqual(insurantIsOwner ? owner : insurant, 'person') ? {person: get(insurantType, 'person', {})} : {
                        organization: {
                            ...get(insurantType, 'organization', {})
                        }
                    },
                    owner: isEqual(owner, 'person') ? {person: get(ownerType, 'person', {})} : {
                        organization: {
                            ...get(ownerType, 'organization', {})
                        }
                    },
                    policies: policies.filter((_policy,index)=>includes(idList,index)),
                    ...rest
                }
            },
            {
                onSuccess: ({data: response}) => {
                    if (get(response, 'result.osgop_formId')) {
                        navigate(`/osgop/view/${get(response, 'result.osgop_formId')}`);
                    } else {
                        navigate(`/osgop`);
                    }
                }
            }
        )
    }


    useEffect(() => {
        if (!isNil(lastYearPayment) && !isNil(lastYearInsurancePremium)) {
            getRatio()
        }
    }, [lastYearPayment, lastYearInsurancePremium])

    useEffect(() => {
        if (every(values(osgopCalculateData), (_item) => _item > 0 && !isNil(_item))) {
            calculatePremium()
        }
    }, [osgopCalculateData])


    if (isLoadingRegion || isLoadingInsuranceTerms) {
        return <OverlayLoader/>
    }
    console.log('policies',policies)
    console.log('idList',idList)

    return (<>
        {(isLoadingCountry || isLoadingPersonalInfo || isLoadingOrganizationInfo || isLoadingVehicleInfo || isLoadingPost) &&
            <OverlayLoader/>}
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
                    <Form formRequest={create} getValueFromField={(value, name) => getFieldData(name, value)}
                          footer={<Flex className={'mt-32'}><Button className={'mr-16'}>Сохранить</Button></Flex>}>
                        <Row gutterWidth={60} className={'mt-32'}>
                            <Col xs={4} style={{borderRight: '1px solid #DFDFDF'}}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Статус</Col>
                                    <Col xs={7}><Button green>Новый</Button></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Филиал</Col>
                                    <Col xs={7}><Field disabled defaultValue={get(user, 'branch_Id.fond_id')}
                                                       label={'Filial'} params={{required: true}} options={filialList}
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
                                    <Col xs={7}><Field params={{required: true}} property={{hideLabel: true}}
                                                       type={'input'}
                                                       name={'number'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={4}>

                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Страховая сумма: </Col>
                                    <Col xs={7}><Field params={{required: true}}
                                                       defaultValue={sumBy(policies, 'insuranceSum')}
                                                       property={{hideLabel: true, disabled: true}}
                                                       type={'number-format-input'}
                                                       name={'sum'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Страховая премия: </Col>
                                    <Col xs={7}><Field params={{required: true}}
                                                       defaultValue={sumBy(policies, 'insurancePremium')}
                                                       property={{hideLabel: true, disabled: true}}
                                                       type={'number-format-input'}
                                                       name={'premium'}/></Col>
                                </Row>



                            </Col>
                            <Col xs={4}>

                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Срок страхования:</Col>
                                    <Col xs={7}><Field options={insuranceTermsList} params={{required: true}}
                                                       label={'Insurance term'} property={{hideLabel: true}}
                                                       type={'select'}
                                                       name={'insuranceTermId'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Дата начала покрытия: </Col>
                                    <Col xs={7}><Field
                                        params={{required: true}}
                                        property={{
                                            hideLabel: true,
                                            onChange: (val) => setPoliceStartDate(val),
                                            dateFormat: 'dd.MM.yyyy'
                                        }}
                                        type={'datepicker'}
                                        name={'contractStartDate'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Дача окончания покрытия: </Col>
                                    <Col xs={7}><Field
                                        params={{required: true}}
                                        defaultValue={getEndDateByInsuranceTerm(find(get(insuranceTerms, `data.result`, []), (_insuranceTerm) => get(_insuranceTerm, 'id') == insuranceTerm), policeStartDate)}
                                        disabled={!isEqual(insuranceTerm, 6)}
                                        property={{hideLabel: true, dateFormat: 'dd.MM.yyyy'}} type={'datepicker'}
                                        name={'contractEndDate'}/></Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row gutterWidth={60} className={'mt-30'}>
                            <Col xs={12} className={'mb-25'}><Title>Собственник </Title></Col>
                            <Col xs={12}>
                                <Row>
                                    <Col xs={4}>
                                        <Flex>
                                            <h4 className={'mr-16'}>Собственник </h4>
                                            <Button onClick={() => setOwner('person')}
                                                    gray={!isEqual(owner, 'person')} className={'mr-16'}
                                                    type={'button'}>Физ. лицо</Button>
                                            <Button onClick={() => setOwner('organization')}
                                                    gray={!isEqual(owner, 'organization')} type={'button'}>Юр.
                                                лицо</Button>
                                        </Flex>
                                    </Col>
                                    <Col xs={8} className={'text-right'}>
                                        {isEqual(owner, 'person') && <Flex justify={'flex-end'}>
                                            <Field
                                                className={'mr-16'} style={{width: 75}}
                                                property={{
                                                    hideLabel: true, mask: 'aa', placeholder: 'AA', maskChar: '_',
                                                    onChange: (val) => setPassportSeries(upperCase(val))
                                                }}
                                                name={'passportSeries'}
                                                type={'input-mask'}
                                            />
                                            <Field property={{
                                                hideLabel: true,
                                                mask: '9999999',
                                                placeholder: '1234567',
                                                maskChar: '_',
                                                onChange: (val) => setPassportNumber(val)
                                            }} name={'passportNumber'} type={'input-mask'}/>

                                            <Field className={'ml-15'}
                                                   property={{
                                                       hideLabel: true,
                                                       placeholder: 'Дата рождения',
                                                       onChange: (e) => setBirthDate(e)
                                                   }}
                                                   name={'birthDate'} type={'datepicker'}/>
                                            <Button onClick={() => getInfo('owner')} className={'ml-15'}
                                                    type={'button'}>Получить
                                                данные</Button>
                                        </Flex>}
                                        {isEqual(owner, 'organization') && <Flex justify={'flex-end'}>
                                            <Field onChange={(e) => setInn(e.target.value)} property={{
                                                hideLabel: true,
                                                mask: '999999999',
                                                placeholder: 'Inn',
                                                maskChar: '_'
                                            }} name={'inn'} type={'input-mask'}/>

                                            <Button onClick={() => getOrgInfo('owner')} className={'ml-15'}
                                                    type={'button'}>Получить
                                                данные</Button>
                                        </Flex>}
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={12}>
                                <hr className={'mt-15 mb-15'}/>
                            </Col>
                            {isEqual(owner, 'person') && <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(ownerPerson, 'lastNameLatin')}
                                           label={'Lastname'}
                                           type={'input'}
                                           name={'insurant.person.fullName.lastname'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(ownerPerson, 'firstNameLatin')}
                                           label={'Firstname'}
                                           type={'input'}
                                           name={'insurant.person.fullName.firstname'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(ownerPerson, 'middleNameLatin')}
                                           label={'Middlename'}
                                           type={'input'}
                                           name={'insurant.person.fullName.middlename'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(ownerPerson, 'startDate')}
                                           label={'Дата выдачи паспорта'}
                                           type={'datepicker'}
                                           name={'insurant.person.passportData.startDate'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(ownerPerson, 'issuedBy')}
                                           label={'Кем выдан'}
                                           type={'input'}
                                           name={'insurant.person.passportData.issuedBy'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        defaultValue={get(ownerPerson, 'gender')}
                                        options={genderList}
                                        label={'Gender'}
                                        type={'select'}
                                        name={'insurant.person.gender'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(ownerPerson, 'pinfl')}
                                           label={'ПИНФЛ'} type={'input'}
                                           name={'insurant.person.passportData.pinfl'}/>
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
                                        defaultValue={get(ownerPerson, 'phone')}
                                        label={'Phone'}
                                        type={'input'}
                                        property={{placeholder: '998XXXXXXXXX'}}
                                        name={'insurant.person.phone'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(ownerPerson, 'email')}
                                        label={'Email'}
                                        type={'input'}
                                        name={'insurant.person.email'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={residentTypeList}
                                        defaultValue={get(ownerPerson, 'residentType')}
                                        label={'Resident type'}
                                        type={'select'}
                                        name={'insurant.person.residentType'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        label={'Серия вод. удостоверения'}
                                        type={'input'}
                                        name={'insurant.person.driverLicenseSeria'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        label={'Номер вод. удостоверения'}
                                        type={'input'}
                                        name={'insurant.person.driverLicenseNumber'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(ownerPerson, 'birthCountry')}
                                        label={'Country'}
                                        type={'select'}
                                        options={countryList}
                                        name={'insurant.person.countryId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={regionList}
                                        defaultValue={get(ownerPerson, 'regionId')}
                                        label={'Region'}
                                        type={'select'}
                                        name={'insurant.person.regionId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={districtList}
                                        defaultValue={get(ownerPerson, 'districtId')}
                                        label={'District'}
                                        type={'select'}
                                        name={'insurant.person.districtId'}/>
                                </Col>

                                <Col xs={3}>
                                    <Field
                                        params={{required: true}}
                                        options={areaTypesList}
                                        defaultValue={get(ownerPerson, 'areaTypeId')}
                                        label={'Тип местности'}
                                        type={'select'}
                                        name={'areaTypeId'}/>
                                </Col>
                                <Col xs={6} className={'mb-25'}>
                                    <Field
                                        noMaxWidth
                                        params={{required: true}}
                                        defaultValue={get(ownerPerson, 'address')}
                                        label={'Address'}
                                        type={'input'}
                                        name={'insurant.person.address'}/>
                                </Col>
                                <Col xs={1} className={'mt-15'}>
                                    <Field
                                        property={{disabled: true, type: 'hidden', hideLabel: true}}
                                        defaultValue={passportSeries}
                                        type={'input'}
                                        name={'insurant.person.passportData.seria'}/>
                                </Col>
                                <Col xs={1} className={'mt-15'}>
                                    <Field
                                        property={{disabled: true, type: 'hidden', hideLabel: true}}
                                        defaultValue={passportNumber}
                                        type={'input'}
                                        name={'insurant.person.passportData.number'}/>
                                </Col>
                                <Col xs={1} className={'mt-15'}>
                                    <Field
                                        property={{disabled: true, type: 'hidden', hideLabel: true}}
                                        defaultValue={dayjs(birthDate).format("YYYY-MM-DD")}
                                        type={'input'}
                                        name={'insurant.person.birthDate'}/>
                                </Col>
                            </>}
                            {isEqual(owner, 'organization') && <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(ownerOrganization, 'name')}
                                           label={'Наименование'} type={'input'}
                                           name={'insurant.organization.name'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field label={'Руководитель'} type={'input'}
                                           name={'insurant.organization.representativeName'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field label={'Должность'} type={'input'}
                                           name={'insurant.organization.position'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(ownerOrganization, 'email')} label={'Email'} type={'input'}
                                           name={'insurant.organization.email'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(ownerOrganization, 'phone')} params={{
                                        required: true,
                                        pattern: {
                                            value: /^998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/,
                                            message: 'Invalid format'
                                        }
                                    }}
                                           property={{placeholder: '998XXXXXXXXX'}}
                                           label={'Телефон'} type={'input'}
                                           name={'insurant.organization.phone'}/>
                                </Col>
                                <Col xs={3}><Field defaultValue={parseInt(get(ownerOrganization, 'oked'))}
                                                   label={'Oked'} params={{required: true, valueAsString: true}}
                                                   options={okedList}
                                                   type={'select'}
                                                   name={'insurant.organization.oked'}/></Col>

                                <Col xs={3} className={'mb-25'}>
                                    <Field label={'Расчетный счет'} type={'input'}
                                           name={'insurant.organization.checkingAccount'}/>
                                </Col>
                                <Col xs={3}><Field label={'Форма собственности'}
                                                   options={ownershipFormList}
                                                   type={'select'}
                                                   name={'insurant.organization.ownershipFormId'}/></Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        defaultValue={get(ownerOrganization, 'birthCountry', 210)}
                                        label={'Country'}
                                        type={'select'}
                                        options={countryList}
                                        name={'insurant.organization.countryId'}/>
                                </Col>
                                <Col xs={3}><Field label={'Область'} params={{required: true}} options={regionList}
                                                   type={'select'}
                                                   name={'insurant.organization.regionId'}/></Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={districtList}
                                        defaultValue={get(ownerOrganization, 'districtId')}
                                        label={'District'}
                                        type={'select'}
                                        name={'insurant.organization.districtId'}/>
                                </Col>
                                <Col xs={3}>
                                    <Field
                                        params={{required: true}}
                                        options={areaTypesList}
                                        defaultValue={get(ownerOrganization, 'areaTypeId')}
                                        label={'Тип местности'}
                                        type={'select'}
                                        name={'areaTypeId'}/>
                                </Col>
                                <Col xs={6} className={'mb-25'}>
                                    <Field
                                        noMaxWidth
                                        params={{required: true}}
                                        defaultValue={get(ownerOrganization, 'address')}
                                        label={'Address'}
                                        type={'input'}
                                        name={'insurant.organization.address'}/>
                                </Col>
                                <Col xs={1} className={'mt-15'}>
                                    <Field
                                        property={{disabled: true, type: 'hidden', hideLabel: true}}
                                        defaultValue={inn}
                                        type={'input'}
                                        name={'insurant.organization.inn'}/>
                                </Col>


                            </>}
                            <Col xs={12} className={'mt-15'}><Checkbox checked={insurantIsOwner}
                                                                       onChange={(e) => setInsuranttIsOwner(e.target.checked)}
                                                                       className={'mr-5'}/><strong>Собственник является
                                Страхователем</strong></Col>
                        </Row>

                        <Row gutterWidth={60} className={'mt-30'}>
                            <Col xs={12} className={'mb-25'}><Title>Страхователь </Title></Col>
                            <Col xs={12}>
                                <Row>
                                    <Col xs={4}>
                                        <Flex>
                                            <h4 className={'mr-16'}>Страхователь </h4>
                                            <Button onClick={() => !insurantIsOwner && setInsurant('person')}
                                                    gray={!isEqual(insurantIsOwner ? owner : insurant, 'person')}
                                                    className={'mr-16'}
                                                    type={'button'}>Физ. лицо</Button>
                                            <Button onClick={() => !insurantIsOwner && setInsurant('organization')}
                                                    gray={!isEqual(insurantIsOwner ? owner : insurant, 'organization')}
                                                    type={'button'}>Юр.
                                                лицо</Button>
                                        </Flex>
                                    </Col>
                                    <Col xs={8} className={'text-right'}>
                                        {isEqual(insurantIsOwner ? owner : insurant, 'person') &&
                                            <Flex justify={'flex-end'}>
                                                <Field
                                                    defaultValue={insurantIsOwner ? passportSeries : insurantPassportSeries}
                                                    onChange={(e) => setInsurantPassportSeries(upperCase(e.target.value))}
                                                    className={'mr-16'} style={{width: 75}}
                                                    property={{
                                                        hideLabel: true, mask: 'aa', placeholder: 'AA', maskChar: '_'
                                                    }}
                                                    name={'insurantPassportSeries'}
                                                    type={'input-mask'}
                                                />
                                                <Field
                                                    defaultValue={insurantIsOwner ? passportNumber : insurantPassportNumber}
                                                    onChange={(e) => setInsurantPassportNumber(e.target.value)}
                                                    property={{
                                                        hideLabel: true,
                                                        mask: '9999999',
                                                        placeholder: '1234567',
                                                        maskChar: '_'
                                                    }} name={'insurantPassportNumber'} type={'input-mask'}/>

                                                <Field defaultValue={insurantIsOwner ? birthDate : null}
                                                       className={'ml-15'}
                                                       property={{
                                                           hideLabel: true,
                                                           placeholder: 'Дата рождения',
                                                           onChange: (e) => setInsurantBirthDate(e)
                                                       }}
                                                       name={'birthDate'} type={'datepicker'}/>
                                                <Button onClick={() => getInfo('insurant')} className={'ml-15'}
                                                        type={'button'}>Получить
                                                    данные</Button>
                                            </Flex>}
                                        {isEqual(insurantIsOwner ? owner : insurant, 'organization') &&
                                            <Flex justify={'flex-end'}>
                                                <Field defaultValue={insurantIsOwner ? inn : null}
                                                       onChange={(e) => setInsurantInn(e.target.value)} property={{
                                                    hideLabel: true,
                                                    mask: '999999999',
                                                    placeholder: 'Inn',
                                                    maskChar: '_'
                                                }} name={'insurantInn'} type={'input-mask'}/>

                                                <Button onClick={() => getOrgInfo('insurant')} className={'ml-15'}
                                                        type={'button'}>Получить
                                                    данные</Button>
                                            </Flex>}
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={12}>
                                <hr className={'mt-15 mb-15'}/>
                            </Col>
                            {isEqual(insurantIsOwner ? owner : insurant, 'person') && <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        defaultValue={get(insurantIsOwner ? ownerPerson : insurantPerson, 'lastNameLatin')}
                                        label={'Lastname'}
                                        type={'input'}
                                        name={'owner.person.fullName.lastname'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        defaultValue={get(insurantIsOwner ? ownerPerson : insurantPerson, 'firstNameLatin')}
                                        label={'Firstname'}
                                        type={'input'}
                                        name={'owner.person.fullName.firstname'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        defaultValue={get(insurantIsOwner ? ownerPerson : insurantPerson, 'middleNameLatin')}
                                        label={'Middlename'}
                                        type={'input'}
                                        name={'owner.person.fullName.middlename'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(insurantIsOwner ? ownerPerson : insurantPerson, 'startDate')}
                                           label={'Дата выдачи паспорта'}
                                           type={'datepicker'}
                                           name={'owner.person.passportData.startDate'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(insurantIsOwner ? ownerPerson : insurantPerson, 'issuedBy')}
                                           label={'Кем выдан'}
                                           type={'input'}
                                           name={'owner.person.passportData.issuedBy'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        defaultValue={get(insurantIsOwner ? ownerPerson : insurantPerson, 'gender')}
                                        options={genderList}
                                        label={'Gender'}
                                        type={'select'}
                                        name={'owner.person.gender'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(insurantIsOwner ? ownerPerson : insurantPerson, 'pinfl')}
                                        label={'ПИНФЛ'} type={'input'}
                                        name={'owner.person.passportData.pinfl'}/>
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
                                        property={{placeholder: '998XXXXXXXXX'}}
                                        defaultValue={insurantIsOwner ? get(otherPrams, 'insurant.person.phone') : null}
                                        label={'Phone'}
                                        type={'input'}
                                        name={'owner.person.phone'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={insurantIsOwner ? get(otherPrams, 'insurant.person.email') : null}
                                        label={'Email'}
                                        type={'input'}
                                        name={'owner.person.email'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={residentTypeList}
                                        defaultValue={insurantIsOwner ? get(otherPrams, 'insurant.person.residentType') : null}
                                        label={'Resident type'}
                                        type={'select'}
                                        name={'owner.person.residentType'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={insurantIsOwner ? get(otherPrams, 'insurant.person.driverLicenseSeria') : null}
                                        label={'Серия вод. удостоверения'}
                                        type={'input'}
                                        name={'owner.person.driverLicenseSeria'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={insurantIsOwner ? get(otherPrams, 'insurant.person.driverLicenseNumber') : null}
                                        label={'Номер вод. удостоверения'}
                                        type={'input'}
                                        name={'owner.person.driverLicenseNumber'}/>
                                </Col>

                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(insurantIsOwner ? ownerPerson : insurantPerson, 'birthCountry')}
                                        label={'Country'}
                                        type={'select'}
                                        options={countryList}
                                        name={'owner.person.countryId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={regionList}
                                        defaultValue={get(insurantIsOwner ? ownerPerson : insurantPerson, 'regionId')}
                                        label={'Region'}
                                        type={'select'}
                                        name={'owner.person.regionId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        options={districtList}
                                        defaultValue={get(insurantIsOwner ? ownerPerson : insurantPerson, 'districtId')}
                                        label={'District'}
                                        type={'select'}
                                        name={'owner.person.districtId'}/>
                                </Col>

                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={areaTypesList}
                                        defaultValue={insurantIsOwner ? get(otherPrams, 'areaTypeId') : null}
                                        label={'Тип местности'}
                                        type={'select'}
                                        name={'areaTypeId'}/>
                                </Col>
                                <Col xs={6} className={'mb-25'}>
                                    <Field
                                        noMaxWidth
                                        params={{required: true}}
                                        defaultValue={get(insurantIsOwner ? ownerPerson : insurantPerson, 'address')}
                                        label={'Address'}
                                        type={'input'}
                                        name={'owner.person.address'}/>
                                </Col>
                                <Col xs={1} className={'mt-15'}>
                                    <Field
                                        property={{disabled: true, type: 'hidden', hideLabel: true}}
                                        defaultValue={insurantIsOwner ? passportSeries : insurantPassportSeries}
                                        type={'input'}
                                        name={'owner.person.passportData.seria'}/>
                                </Col>
                                <Col xs={1} className={'mt-15'}>
                                    <Field
                                        property={{disabled: true, type: 'hidden', hideLabel: true}}
                                        defaultValue={insurantIsOwner ? passportNumber :insurantPassportNumber}
                                        type={'input'}
                                        name={'owner.person.passportData.number'}/>
                                </Col>
                                <Col xs={1} className={'mt-15'}>
                                    <Field
                                        property={{disabled: true, type: 'hidden', hideLabel: true}}
                                        defaultValue={dayjs(insurantIsOwner ? birthDate : insurantBirthDate).format("YYYY-MM-DD")}
                                        type={'input'}
                                        name={'owner.person.birthDate'}/>
                                </Col>

                            </>}
                            {isEqual(insurantIsOwner ? owner : insurant, 'organization') && <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(insurantIsOwner ? ownerOrganization : insurantOrganization, 'name')}
                                           label={'Наименование'} type={'input'}
                                           name={'owner.organization.name'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field  defaultValue={insurantIsOwner ? get(otherPrams, 'insurant.organization.representativeName'):null} label={'Руководитель'} type={'input'}
                                           name={'owner.organization.representativeName'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={insurantIsOwner ? get(otherPrams, 'insurant.organization.position'):null} label={'Должность'} type={'input'}
                                           name={'owner.organization.position'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={insurantIsOwner ? get(otherPrams, 'insurant.organization.email'):null}
                                        label={'Email'} type={'input'}
                                        name={'owner.organization.email'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(insurantIsOwner ? ownerOrganization : insurantOrganization, 'phone',get(otherPrams, 'insurant.organization.phone'))}
                                        params={{
                                            required: true,
                                            pattern: {
                                                value: /^998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/,
                                                message: 'Invalid format'
                                            }
                                        }}
                                        property={{placeholder: '998XXXXXXXXX'}}
                                        label={'Телефон'} type={'input'}
                                        name={'owner.organization.phone'}/>
                                </Col>
                                <Col xs={3}><Field
                                    defaultValue={parseInt(get(insurantIsOwner ? ownerOrganization : insurantOrganization, 'oked'))}
                                    label={'Oked'}
                                    params={{required: true, valueAsString: true}}
                                    options={okedList}
                                    type={'select'}
                                    name={'owner.organization.oked'}/></Col>

                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={insurantIsOwner ? get(otherPrams, 'insurant.organization.checkingAccount'):null} label={'Расчетный счет'} type={'input'}
                                           name={'owner.organization.checkingAccount'}/>
                                </Col>
                                <Col xs={3}><Field defaultValue={insurantIsOwner ? get(otherPrams, 'insurant.organization.ownershipFormId'):null} label={'Форма собственности'}
                                                   options={ownershipFormList}
                                                   type={'select'}
                                                   name={'owner.organization.ownershipFormId'}/></Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        defaultValue={get(insurantIsOwner ? ownerOrganization : insurantOrganization, 'birthCountry', 210)}
                                        label={'Country'}
                                        type={'select'}
                                        options={countryList}
                                        name={'owner.organization.countryId'}/>
                                </Col>
                                <Col xs={3}><Field defaultValue={insurantIsOwner ? get(otherPrams, 'insurant.organization.regionId'):null} label={'Область'} params={{required: true}} options={regionList}
                                                   type={'select'}
                                                   name={'owner.organization.regionId'}/></Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={districtList}
                                        defaultValue={get(insurantIsOwner ? ownerOrganization : insurantOrganization, 'districtId',get(otherPrams, 'insurant.organization.districtId'))}
                                        label={'District'}
                                        type={'select'}
                                        name={'owner.organization.districtId'}/>
                                </Col>


                                <Col xs={3}>
                                    <Field
                                        params={{required: true}}
                                        options={areaTypesList}
                                        defaultValue={insurantIsOwner ? get(otherPrams, 'areaTypeId'):null}
                                        label={'Тип местности'}
                                        type={'select'}
                                        name={'areaTypeId'}/>
                                </Col>
                                <Col xs={6}>
                                    <Field
                                        noMaxWidth
                                        params={{required: true}}
                                        defaultValue={get(insurantIsOwner ? ownerOrganization : insurantOrganization, 'address')}
                                        label={'Address'}
                                        type={'input'}
                                        name={'owner.organization.address'}/>
                                </Col>
                                <Col xs={1} className={'mt-15'}>
                                    <Field
                                        property={{disabled: true, type: 'hidden', hideLabel: true}}
                                        defaultValue={insurantIsOwner ? inn : insurantInn}
                                        type={'input'}
                                        name={'owner.organization.inn'}/>
                                </Col>

                            </>}
                        </Row>

                        <Row gutterWidth={60} className={'mt-30'}>
                            <Col xs={12} className={'mb-15'}><Title>Убыточность предыдущих периодов</Title></Col>
                            <Col xs={3}>
                                <Field params={{required: true}} label={'Сумма старховых возмещений в предыдущем году'}
                                       type={'number-format-input'}
                                       name={'lastYearPayment'}/>
                            </Col>
                            <Col xs={3}><Field params={{required: true}} name={'lastYearInsurancePremium'}
                                               label={'Сумма старховой премии в предыдущем году '}
                                               type={'number-format-input'}
                            /></Col>
                            <Col xs={3}><Field params={{required: true}}
                                               defaultValue={get(ratioResponse, 'lossRatio', 0)}
                                               property={{disabled: true}}
                                               name={'lossRatio'}
                                               label={'Уровень убыточности '}
                                               type={'input'}
                            /></Col>
                            <Col xs={3}><Field params={{required: true}} property={{disabled: true}}
                                               defaultValue={get(ratioResponse, 'lossCoefficient', 0)}
                                               name={'lossCoefficient'}
                                               label={'Коэффициент страховых тарифов'}
                                               type={'number-format-input'}
                            /></Col>
                        </Row>

                        <Row gutterWidth={60} className={'mt-30'}>
                            <Col xs={12} className={'mb-15'}><Title>Объекты страхования</Title></Col>
                            <Col xs={12}>
                                <Flex justify={'flex-end'}>
                                    <Button
                                        onClick={() => setVisible(true)} className={'ml-15'}
                                        type={'button'}>Добавить</Button></Flex>
                            </Col>
                            <Col xs={12}>
                                <div className={'horizontal-scroll mt-15 mb-25'}>
                                    <Table bordered hideThead={false}
                                           thead={[<Checkbox onChange={(e) => {
                                               if (e.target?.checked) {
                                                   setIdList(policies.map((_policy,index) => index))
                                               } else {
                                                   setIdList([])
                                               }
                                           }}/>,'№ ', 'Вид ТС', 'Модель ТС', 'Гос.номер', 'Страховая премия', 'Страховая сумма', 'Action']}>
                                        {
                                            policies.map((item, index) => <tr>
                                                <td><Checkbox checked={includes(idList,index)} onChange={(e) => {
                                                    if (e.target?.checked) {
                                                        setIdList(prev => ([...prev, index]))
                                                    } else {
                                                        setIdList(idList.filter(id => !isEqual(id, index)))
                                                    }
                                                }}/></td>
                                                <td>{index + 1}</td>
                                                <td>{get(find(vehicleTypeList, (_vehicle) => get(_vehicle, 'value') == get(item, 'objects[0].vehicle.vehicleTypeId')), 'label', '-')}</td>
                                                <td>{get(item, 'objects[0].vehicle.modelCustomName')}</td>
                                                <td>{get(item, 'objects[0].vehicle.govNumber')}</td>
                                                <td><NumberFormat value={get(item, 'insurancePremium', 0)}
                                                                  displayType={'text'} thousandSeparator={' '}/></td>
                                                <td><NumberFormat value={get(item, 'insuranceSum', 0)}
                                                                  displayType={'text'} thousandSeparator={' '}/></td>

                                                <td><Trash2
                                                    onClick={() => setPolicies(policies.filter((d, i) => i != index))}
                                                    className={'cursor-pointer'} color={'red'}/></td>
                                            </tr>)
                                        }
                                    </Table>
                                </div>
                            </Col>
                        </Row>

                        <Row gutterWidth={60} className={'mt-30'}>
                            <Col xs={12} className={'mb-25'}><Title>Агентсткое вознограждение и РПМ</Title></Col>
                            <Col xs={8}>
                                <Row>
                                    <Col xs={12} className={'mb-25'}>
                                        <Field
                                            options={[{label: t('No agent'), value: undefined}, ...agentsList]}
                                            label={'Агент'}
                                            type={'select'}
                                            name={'agentId'}/>
                                    </Col>

                                    <Col xs={6} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            property={{
                                                type: 'number',
                                                disabled: isEqual(agentId, undefined),
                                                valueAsNumber: true
                                            }}
                                            defaultValue={isEqual(agentId, undefined) ? 0 : 25}
                                            label={'Вознограждение %'}
                                            type={'input'}
                                            name={'agentReward'}/>
                                    </Col>
                                    <Col xs={6} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            defaultValue={5}
                                            property={{disabled: true}}
                                            label={'Отчисления в РПМ  %'}
                                            type={'input'}
                                            name={'rpm'}/>
                                    </Col>
                                    <Col xs={6} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            defaultValue={round(rewardPercent * sumBy(policies, 'insuranceSum') / 100, 2)}
                                            property={{disabled: true}}
                                            label={'Сумма'}
                                            type={'number-format-input'}
                                            name={'comission'}/>
                                    </Col>
                                    <Col xs={6} className={'mb-25'}>
                                        <Field
                                            defaultValue={round(rpmPercent * sumBy(policies, 'insurancePremium') / 100, 2)}
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
            <Modal title={'Добавление объекта страхования'} hide={() => setVisible(false)} visible={visible}>
                {isLoadingVehicleInfo && <OverlayLoader/>}
                <Form
                    formRequest={({data: item}) => {
                        if (!isEmpty(get(item, 'vehicle'))) {
                            setPolicies(prev => ([...prev, get(item, 'vehicle')]));
                        }
                        setVisible(false)
                    }}
                    getValueFromField={(value, name) => getFieldData(name, value)}
                    footer={<Flex className={'mt-32'}><Button>Добавить</Button></Flex>}>
                    <Row align={'end'}>
                        <Col xs={9} className={' mt-15'}>
                            <Flex align={'items-end'}>
                                <Field params={{required: true}} onChange={(e) => setGovNumber(e.target.value)}
                                       className={'mr-16'}
                                       label={'Гос.номер'}
                                       name={'vehicle.objects[0].vehicle.govNumber'}
                                       type={'input'}
                                />
                                <Field params={{required: true}} className={'mr-16'}
                                       onChange={(e) => setTechPassportSeria(e.target.value)}
                                       name={'vehicle.objects[0].vehicle.techPassport.seria'}
                                       type={'input'}
                                       label={'Серия тех.паспорта'}
                                />

                                <Field params={{required: true}} onChange={(e) => setTechPassportNumber(e.target.value)}
                                       name={'vehicle.objects[0].vehicle.techPassport.number'} type={'input'}
                                       label={'Номер тех.паспорта'}
                                />

                            </Flex></Col>
                        <Col xs={3}>
                            <Button onClick={() => getVehicleInfo()} className={'ml-15'}
                                    type={'button'}>Получить
                                данные</Button>
                        </Col>
                        <Col xs={12}>
                            <hr className={'mt-15'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field params={{required: true}}
                                   options={vehicleTypeList}
                                   defaultValue={get(vehicle, 'vehicleTypeId', 0)} label={'Вид ТС'}
                                   type={'select'}
                                   name={'vehicle.objects[0].vehicle.vehicleTypeId'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field params={{required: true}}
                                   defaultValue={get(vehicle, 'modelName')} label={'Модель ТС'}
                                   type={'input'}
                                   name={'vehicle.objects[0].vehicle.modelCustomName'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field params={{required: true}}
                                   defaultValue={get(vehicle, 'bodyNumber')} label={'Номер кузова (шасси)'}
                                   type={'input'}
                                   name={'vehicle.objects[0].vehicle.bodyNumber'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field
                                defaultValue={get(vehicle, 'liftingCapacity')} label={'Грузоподъемность'}
                                property={{type: 'number'}}
                                type={'input'}
                                name={'vehicle.objects[0].vehicle.liftingCapacity'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field
                                params={{required: true, valueAsNumber: true}}
                                defaultValue={get(vehicle, 'seats')} label={'Количество мест сидения'}
                                property={{type: 'number'}}
                                type={'input'}
                                name={'vehicle.objects[0].vehicle.numberOfSeats'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field params={{required: true}} defaultValue={get(vehicle, 'issueYear')}
                                   label={'Год выпуска'} type={'input'}
                                   name={'vehicle.objects[0].vehicle.issueYear'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field defaultValue={get(vehicle, 'engineNumber')}
                                   label={'Номер двигателя'} type={'input'}
                                   name={'vehicle.objects[0].vehicle.engineNumber'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field
                                label={'Иностранный'} type={'switch'}
                                name={'vehicle.objects[0].vehicle.isForeign'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field params={{required: true}}
                                   options={regionList}
                                   defaultValue={get(vehicle, 'regionId')} label={'Регион регистрации'}
                                   type={'select'}
                                   name={'vehicle.objects[0].vehicle.regionId'}/>
                        </Col>
                        <Col xs={12} className={'mt-15'}>
                            <hr/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field
                                property={{type: 'number', max: 1000}}
                                defaultValue={get(vehicle, 'passengerCapacity', 0)}
                                label={'Пассажировместимость ТС'}
                                type={'input'}
                                name={'passengerCapacity'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field
                                label={'Страховая сумма на одного пассажира'}
                                type={'number-format-input'}
                                name={'insuranceSumForPassenger'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field
                                params={{required: true}}
                                property={{disabled: true}}
                                defaultValue={get(osgopCalculateResponse, 'insuranceSum', 0)}
                                label={'Страховая сумма'}
                                type={'number-format-input'}
                                name={'vehicle.insuranceSum'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field
                                params={{required: true}}
                                property={{disabled: true}}
                                defaultValue={get(osgopCalculateResponse, 'annualBaseRate', 0)}
                                label={'Годовая базовая ставка'}
                                type={'number-format-input'}
                                name={'vehicle.insuranceRate'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field
                                params={{required: true}}
                                property={{disabled: true}}
                                defaultValue={get(osgopCalculateResponse, 'insurancePremium', 0)}
                                label={'Страховая премия'}
                                type={'number-format-input'}
                                name={'vehicle.insurancePremium'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field
                                property={{disabled: true, type: 'hidden', hideLabel: true}}
                                defaultValue={get(osgopCalculateResponse, 'healthLifeDamageSum', 0)}
                                type={'input'}
                                name={'vehicle.healthLifeDamageSum'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field
                                property={{disabled: true, type: 'hidden', hideLabel: true}}
                                defaultValue={get(osgopCalculateResponse, 'propertyDamageSum', 0)}
                                type={'input'}
                                name={'vehicle.propertyDamageSum'}/>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </Section>
    </>);
};

export default CreateContainer;