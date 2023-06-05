import React, {useEffect, useMemo, useState} from 'react';
import {useStore} from "../../../../store";
import {find, get, head, isEqual, isNil, round, upperCase} from "lodash";
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

const getEndDateByInsuranceTerm = (term, startDate) => {
    if (!isNil(term)) {
        return dayjs(startDate).add(get(term, 'value'), get(term, 'prefix')).toDate()
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
    const [inn, setInn] = useState(null)
    const [regionId, setRegionId] = useState(null)
    const [insuranceTerm, setInsuranceTerm] = useState(null)
    const [policeStartDate, setPoliceStartDate] = useState(dayjs())
    const [insurancePremium, setInsurancePremium] = useState(0)
    const [rpmPercent, setRpmPercent] = useState(0)
    const [rewardPercent, setRewardPercent] = useState(0)
    const [govNumber, setGovNumber] = useState(null)
    const [techPassportSeria, setTechPassportSeria] = useState(null)
    const [techPassportNumber, setTechPassportNumber] = useState(null)
    const [vehicleType, setVehicleType] = useState(null)
    const [discount, setDiscount] = useState(null)
    const [driverType, setDriverType] = useState(1)
    const [termCategories, setTermCategories] = useState(null)
    const [accident, setAccident] = useState(null)
    const [insurantIsOwner, setInsuranttIsOwner] = useState(false)
    const [cost, setCost] = useState(null)
    const [visible, setVisible] = useState(false)
    const [driver, setDriver] = useState(null)
    const [drivers, setDrivers] = useState([])
    const [agencyId, setAgencyId] = useState(null)
    const [agentId, setAgentId] = useState(null)
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
        mutate: calculatePremiumRequest
    } = usePostQuery({listKeyId: KEYS.calculator, hideSuccessToast: false})
    const {
        mutate: calcRequest
    } = usePostQuery({listKeyId: KEYS.calculator, hideSuccessToast: false})

    const {
        mutate: getDriverInfoRequest, isLoading: isLoadingDriverInfo
    } = usePostQuery({listKeyId: KEYS.driverInfo})
    const {
        mutate: createRequest, isLoading: isLoadingPost
    } = usePostQuery({listKeyId: KEYS.create})

    const getInfo = (type = 'owner') => {
        getPersonalInfoRequest({
                url: URLS.personalInfoProvider, attributes: {
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
                url: URLS.organizationInfoProvider, attributes: {
                    inn
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
        calculatePremiumRequest({
                url: URLS.calculator, attributes: {
                    vehicleType,
                    region: regionId,
                    discount,
                    driverType,
                    terms: insuranceTerm,
                    termCategories,
                    accident
                }
            },
            {
                onSuccess: ({data}) => {
                    setInsurancePremium(get(data, 'result.amount'))
                    setCost(get(data, 'result.cost'))
                }
            }
        )
    }

    const addDriver = ({data}) => {
        if (get(data, 'driver.fullName.firstname')) {
            setDrivers(prev => [...prev, get(data, 'driver')])
            setVisible(false);
        }
    }
    const removeDriver = (index) => {
        setDrivers(drivers.filter((d, i) => i != index))
    }
    const getFieldData = (name, value) => {
        if (isEqual(name, 'owner.person.regionId')) {
            setRegionId(value)
        }
        if (isEqual(name, 'terms')) {
            setInsuranceTerm(value)
        }

        if (isEqual(name, 'rpm')) {
            setRpmPercent(value)
        }
        if (isEqual(name, 'agentReward')) {
            setRewardPercent(value)
        }
        if (isEqual(name, 'vehicle.typeId')) {
            setVehicleType(value)
        }
        if (isEqual(name, 'discount')) {
            setDiscount(value)
        }
        if (isEqual(name, 'termCategories')) {
            setTermCategories(value)
        }
        if (isEqual(name, 'accident')) {
            setAccident(value)
        }
        if (isEqual(name, 'vehicle.regionId')) {
            setRegionId(value)
        }
        if (isEqual(name, 'agencyId')) {
            setAgencyId(value)
        }
        if (isEqual(name, 'agentId')) {
            setAgentId(value)
        }
        if (isEqual(name, 'policies[0].insuranceTermId')) {
            setInsuranceTerm(value)
        }
    }

    const create = ({data}) => {
        const {
            accident,
            discount,
            birthDate,
            number,
            passportNumber,
            passportSeries,
            policies,
            rewardSum,
            rpmSum,
            seria,
            termCategories,
            terms,
            details,
            vehicle,
            owner,
            agentReward,
            ...rest
        } = data
        const {regionId, ...vehicleRestData} = vehicle;
        createRequest({
                url: URLS.create, attributes: {
                    contractStartDate: get(head(policies), 'startDate'),
                    contractEndDate: get(head(policies), 'endDate'),
                    cost,
                    details: {...details, driverNumberRestriction: true, specialNote: '', insuredActivityType: ''},
                    vehicle: {...vehicleRestData, govNumber, regionId},
                    owner: {
                        ...owner,
                        insurantIsOwner: insurantIsOwner
                    },
                    agentReward: parseInt(agentReward),
                    drivers,
                    ...rest
                }
            },
            {
                onSuccess: ({data: response}) => {
                    if (get(response, 'result.application_number')) {
                        navigate(`/osgop/view/${get(response, 'result.application_number')}`);
                    } else {
                        navigate(`/osgop`);
                    }
                }
            }
        )
    }


    useEffect(() => {
        if (accident && insuranceTerm && termCategories && driverType && vehicleType) {
            calculatePremium()
        }
    }, [accident, insuranceTerm, termCategories, driverType, vehicleType])


    if (isLoadingRegion || isLoadingInsuranceTerms) {
        return <OverlayLoader/>
    }

    console.log('vehicleTypeList', vehicleTypeList)
    console.log('vehicle', vehicle)
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
                                    <Col xs={7}><Field params={{required: true}} defaultValue={40000000}
                                                       property={{hideLabel: true, disabled: true}}
                                                       type={'number-format-input'}
                                                       name={'policies[0].insuranceSum'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Страховая премия: </Col>
                                    <Col xs={7}><Field params={{required: true}} defaultValue={insurancePremium}
                                                       property={{hideLabel: true, disabled: true}}
                                                       type={'number-format-input'}
                                                       name={'policies[0].insurancePremium'}/></Col>
                                </Row>


                            </Col>
                            <Col xs={4}>

                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Срок страхования:</Col>
                                    <Col xs={7}><Field options={insuranceTermsList} params={{required: true}}
                                                       label={'Insurance term'} property={{hideLabel: true}}
                                                       type={'select'}
                                                       name={'policies[0].insuranceTermId'}/></Col>
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
                                        name={'policies[0].startDate'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Дача окончания покрытия: </Col>
                                    <Col xs={7}><Field
                                        params={{required: true}}
                                        defaultValue={getEndDateByInsuranceTerm(find(get(insuranceTerms, `data.result`, []), (_insuranceTerm) => get(_insuranceTerm, 'id') == insuranceTerm), policeStartDate)}
                                        disabled={!isEqual(insuranceTerm, 6)}
                                        property={{hideLabel: true, dateFormat: 'dd.MM.yyyy'}} type={'datepicker'}
                                        name={'policies[0].endDate'}/></Col>
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
                                    <Field params={{required: true}} defaultValue={get(ownerPerson, 'firstNameLatin')}
                                           label={'Firstname'}
                                           type={'input'}
                                           name={'insurant.person.fullName.firstname'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(ownerPerson, 'lastNameLatin')}
                                           label={'Lastname'}
                                           type={'input'}
                                           name={'insurant.person.fullName.lastname'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(ownerPerson, 'middleNameLatin')}
                                           label={'Middlename'}
                                           type={'input'}
                                           name={'insurant.person.fullName.middlename'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(ownerPerson, 'pinfl')}
                                           label={'ПИНФЛ'} type={'input'}
                                           name={'insurant.person.passportData.pinfl'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} property={{
                                        mask: 'aa',
                                        placeholder: 'AA',
                                        maskChar: '_'
                                    }} defaultValue={passportSeries} label={'Passport seria'} type={'input-mask'}
                                           name={'insurant.person.passportData.seria'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} property={{
                                        mask: '9999999',
                                        placeholder: '1234567',
                                        maskChar: '_'
                                    }} defaultValue={passportNumber} label={'Passport number'} type={'input-mask'}
                                           name={'insurant.person.passportData.number'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={dayjs(get(ownerPerson, 'birthDate')).toDate()}
                                           label={'Birth date'}
                                           type={'datepicker'}
                                           name={'insurant.person.birthDate'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(ownerPerson, 'gender')}
                                        options={genderList}
                                        label={'Gender'}
                                        type={'select'}
                                        name={'insurant.person.gender'}/>
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
                                        options={residentTypeList}
                                        defaultValue={get(ownerPerson, 'residentType')}
                                        label={'Resident type'}
                                        type={'select'}
                                        name={'insurant.person.residentType'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(ownerPerson, 'address')}
                                        label={'Address'}
                                        type={'input'}
                                        name={'insurant.person.address'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        defaultValue={get(ownerPerson, 'phone')}
                                        label={'Phone'}
                                        type={'input'}
                                        name={'insurant.person.phone'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(ownerPerson, 'email')}
                                        label={'Email'}
                                        type={'input'}
                                        name={'insurant.person.email'}/>
                                </Col>
                            </>}
                            {isEqual(owner, 'organization') && <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} label={'INN'} defaultValue={inn} property={{
                                        mask: '999999999',
                                        placeholder: 'Inn',
                                        maskChar: '_'
                                    }} name={'insurant.organization.inn'} type={'input-mask'}/>

                                </Col>
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
                                    <Field defaultValue={get(ownerOrganization, 'phone')} params={{required: true}}
                                           label={'Телефон'} type={'input'}
                                           name={'insurant.organization.phone'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(ownerOrganization, 'email')} label={'Email'} type={'input'}
                                           name={'insurant.organization.email'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field label={'Расчетный счет'} type={'input'}
                                           name={'insurant.organization.checkingAccount'}/>
                                </Col>
                                <Col xs={3}><Field label={'Область'} params={{required: true}} options={regionList}
                                                   type={'select'}
                                                   name={'insurant.organization.regionId'}/></Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(ownerOrganization, 'address')}
                                        label={'Address'}
                                        type={'input'}
                                        name={'insurant.organization.address'}/>
                                </Col>
                                <Col xs={3}><Field label={'Форма собственности'} params={{required: true}}
                                                   options={ownershipFormList}
                                                   type={'select'}
                                                   name={'insurant.organization.ownershipFormId'}/></Col>
                                <Col xs={3}><Field defaultValue={parseInt(get(ownerOrganization, 'oked'))}
                                                   label={'Oked'} params={{required: true}}
                                                   options={okedList}
                                                   type={'select'}
                                                   name={'insurant.organization.oked'}/></Col>
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
                                            <h4 className={'mr-16'}>Заявитель </h4>
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
                                                <Field onChange={(e) => setPassportSeries(upperCase(e.target.value))}
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

                                                <Field className={'ml-15'}
                                                       property={{
                                                           hideLabel: true,
                                                           placeholder: 'Дата рождения',
                                                           onChange: (e) => setBirthDate(e)
                                                       }}
                                                       name={'birthDate'} type={'datepicker'}/>
                                                <Button onClick={() => getInfo('insurant')} className={'ml-15'}
                                                        type={'button'}>Получить
                                                    данные</Button>
                                            </Flex>}
                                        {isEqual(insurantIsOwner ? owner : insurant, 'organization') &&
                                            <Flex justify={'flex-end'}>
                                                <Field onChange={(e) => setInn(e.target.value)} property={{
                                                    hideLabel: true,
                                                    mask: '999999999',
                                                    placeholder: 'Inn',
                                                    maskChar: '_'
                                                }} name={'inn'} type={'input-mask'}/>

                                                <Button onClick={() => getOrgInfo('applicant')} className={'ml-15'}
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
                                        defaultValue={get(insurantIsOwner ? ownerPerson : insurant, 'firstNameLatin')}
                                        label={'Firstname'}
                                        type={'input'}
                                        name={'policies[0].objects[0].ownerPerson.fullName.firstname'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        defaultValue={get(insurantIsOwner ? ownerPerson : insurant, 'lastNameLatin')}
                                        label={'Lastname'}
                                        type={'input'}
                                        name={'policies[0].objects[0].ownerPerson.fullName.lastname'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        defaultValue={get(insurantIsOwner ? ownerPerson : insurant, 'middleNameLatin')}
                                        label={'Middlename'}
                                        type={'input'}
                                        name={'policies[0].objects[0].ownerPerson.fullName.middlename'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(insurantIsOwner ? ownerPerson : insurant, 'pinfl')}
                                           label={'ПИНФЛ'} type={'input'}
                                           name={'policies[0].objects[0].ownerPerson.passportData.pinfl'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} property={{
                                        mask: 'aa',
                                        placeholder: 'AA',
                                        maskChar: '_'
                                    }} defaultValue={passportSeries} label={'Passport seria'} type={'input-mask'}
                                           name={'policies[0].objects[0].ownerPerson.passportData.seria'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        property={{
                                            mask: '9999999',
                                            placeholder: '1234567',
                                            maskChar: '_'
                                        }} defaultValue={passportNumber} label={'Passport number'} type={'input-mask'}
                                        name={'policies[0].objects[0].ownerPerson.passportData.number'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={dayjs(get(insurantIsOwner ? ownerPerson : insurant, 'birthDate')).toDate()}
                                        label={'Birth date'}
                                        type={'datepicker'}
                                        name={'policies[0].objects[0].ownerPerson.birthDate'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(insurantIsOwner ? ownerPerson : insurant, 'gender')}
                                        options={genderList}
                                        label={'Gender'}
                                        type={'select'}
                                        name={'policies[0].objects[0].ownerPerson.gender'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(insurantIsOwner ? ownerPerson : insurant, 'birthCountry')}
                                        label={'Country'}
                                        type={'select'}
                                        options={countryList}
                                        name={'policies[0].objects[0].ownerPerson.countryId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        options={regionList}
                                        defaultValue={get(insurantIsOwner ? ownerPerson : insurant, 'regionId')}
                                        label={'Region'}
                                        type={'select'}
                                        name={'policies[0].objects[0].ownerPerson.regionId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        options={residentTypeList}
                                        defaultValue={get(insurantIsOwner ? ownerPerson : insurant, 'residentType')}
                                        label={'Resident type'}
                                        type={'select'}
                                        name={'policies[0].objects[0].ownerPerson.residentType'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(insurantIsOwner ? ownerPerson : insurant, 'address')}
                                        label={'Address'}
                                        type={'input'}
                                        name={'policies[0].objects[0].ownerPerson.address'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(insurantIsOwner ? ownerPerson : insurant, 'phone')}
                                        label={'Phone'}
                                        type={'input'}
                                        name={'policies[0].objects[0].ownerPerson.phoneNumber'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(insurantIsOwner ? ownerPerson : insurant, 'email')}
                                        label={'Email'}
                                        type={'input'}
                                        name={'policies[0].objects[0].ownerPerson.email'}/>
                                </Col>
                            </>}
                            {isEqual(insurantIsOwner ? owner : insurant, 'organization') && <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} label={'INN'} defaultValue={inn} property={{
                                        mask: '999999999',
                                        placeholder: 'Inn',
                                        maskChar: '_'
                                    }} name={'policies[0].objects[0].ownerOrganization.inn'} type={'input-mask'}/>

                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(insurantIsOwner ? ownerOrganization : insurantOrganization, 'name')}
                                           label={'Наименование'} type={'input'}
                                           name={'policies[0].objects[0].ownerOrganization.name'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field label={'Руководитель'} type={'input'}
                                           name={'policies[0].objects[0].ownerOrganization.representativeName'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field label={'Должность'} type={'input'}
                                           name={'policies[0].objects[0].ownerOrganization.position'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(insurantIsOwner ? ownerOrganization : insurantOrganization, 'phone')}
                                        params={{required: true}}
                                        label={'Телефон'} type={'input'}
                                        name={'policies[0].objects[0].ownerOrganization.phone'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(insurantIsOwner ? ownerOrganization : insurantOrganization, 'email')}
                                        label={'Email'} type={'input'}
                                        name={'policies[0].objects[0].ownerOrganization.email'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field label={'Расчетный счет'} type={'input'}
                                           name={'policies[0].objects[0].ownerOrganization.checkingAccount'}/>
                                </Col>
                                <Col xs={3}><Field label={'Область'} params={{required: true}} options={regionList}
                                                   type={'select'}
                                                   name={'policies[0].objects[0].ownerOrganization.regionId'}/></Col>
                                <Col xs={3}>
                                    <Field
                                        defaultValue={get(insurantIsOwner ? ownerOrganization : insurantOrganization, 'address')}
                                        label={'Address'}
                                        type={'input'}
                                        name={'policies[0].objects[0].ownerOrganization.address'}/>
                                </Col>
                                <Col xs={3}><Field label={'Форма собственности'} params={{required: true}}
                                                   options={ownershipFormList}
                                                   type={'select'}
                                                   name={'policies[0].objects[0].ownerOrganization.ownershipFormId'}/></Col>
                                <Col xs={3}><Field
                                    defaultValue={parseInt(get(insurantIsOwner ? ownerOrganization : insurantOrganization, 'oked'))}
                                    label={'Oked'} params={{required: true}}
                                    options={okedList}
                                    type={'select'}
                                    name={'policies[0].objects[0].ownerOrganization.oked'}/></Col>
                            </>}
                        </Row>

                        <Row gutterWidth={60} className={'mt-30'}>
                            <Col xs={12} className={'mb-15'}><Title>Убыточность предыдущих периодов</Title></Col>
                            <Col xs={3}><Field label={'Сумма старховых возмещений в предыдущем году'}
                                               type={'number-format-input'}
                                               name={'lastYearPayment'}/></Col>
                            <Col xs={3}><Field label={'Сумма старховой премии в предыдущем году'}
                                               type={'number-format-input'}
                                               name={'lastYearInsurancePremium'}/></Col>
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
                                           thead={['№ ', 'Вид ТС', 'Модель ТС', 'Гос.номер', 'Страховая премия', 'Страховая сумма', 'Серия полиса', 'Номер полиса', 'Action']}>
                                        {
                                            drivers.map((item, index) => <tr>
                                                <td>{get(item, 'fullName.lastname')}</td>
                                                <td>{get(item, 'fullName.firstname')}</td>
                                                <td>{get(item, 'fullName.middlename')}</td>
                                                <td>{upperCase(get(item, 'passportData.seria', ''))}</td>
                                                <td>{get(item, 'passportData.number')}</td>
                                                <td>{get(item, 'passportData.pinfl')}</td>
                                                <td>{get(item, 'startDate')}</td>
                                                <td>{get(item, 'licenseSeria')}</td>
                                                <td>{get(item, 'licenseNumber')}</td>
                                                <td>{get(item, 'issueDate')}</td>
                                                <td><Trash2 onClick={() => removeDriver(index)}
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
                                            property={{type: 'number', disabled: isEqual(agentId, undefined)}}
                                            defaultValue={isEqual(agentId, undefined) ? 0 : 20}
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
            <Modal title={'Добавление объекта страхования'} hide={() => setVisible(false)} visible={visible}>
                {isLoadingDriverInfo && <OverlayLoader/>}
                <Form
                    formRequest={addDriver}
                    footer={<Flex className={'mt-32'}><Button>Добавить</Button></Flex>}>
                    <Row align={'end'}>
                        <Col xs={9} className={' mt-15'}>
                            <Flex align={'items-end'}>
                                <Field onChange={(e) => setGovNumber(e.target.value)}
                                       className={'mr-16'}
                                       label={'Гос.номер'}
                                       name={'vehicle.govNumber'}
                                       type={'input'}
                                />
                                <Field className={'mr-16'} onChange={(e) => setTechPassportSeria(e.target.value)}
                                       name={'govNumber.techPassport.seria'}
                                       type={'input'}
                                       label={'Серия тех.паспорта'}
                                />

                                <Field onChange={(e) => setTechPassportNumber(e.target.value)}
                                       name={'govNumber.techPassport.number'} type={'input'}
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
                                   defaultValue={get(vehicle, 'vehicleTypeId')} label={'Вид ТС'}
                                   type={'select'}
                                   name={'vehicle.vehicleTypeId'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field params={{required: true}}
                                   defaultValue={get(vehicle, 'modelName')} label={'Модель ТС'}
                                   type={'input'}
                                   name={'vehicle.modelCustomName'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field params={{required: true}}
                                   defaultValue={get(vehicle, 'bodyNumber')} label={'Номер кузова (шасси)'}
                                   type={'input'}
                                   name={'vehicle.bodyNumber'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field
                                defaultValue={get(vehicle, 'liftingCapacity')} label={'Грузоподъемность'}
                                property={{type: 'number'}}
                                type={'input'}
                                name={'vehicle.liftingCapacity'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field
                                params={{required: true}}
                                defaultValue={get(vehicle, 'seats')} label={'Количество мест сидения'}
                                property={{type: 'number'}}
                                type={'input'}
                                name={'vehicle.numberOfSeats'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field defaultValue={get(vehicle, 'issueYear')} params={{required: true}}
                                   label={'Год выпуска'} type={'input'}
                                   name={'vehicle.issueYear'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field defaultValue={get(vehicle, 'engineNumber')}
                                   label={'Номер двигателя'} type={'input'}
                                   name={'vehicle.engineNumber'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field
                                   label={'Иностранный'} type={'switch'}
                                   name={'vehicle.isForeign'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field params={{required: true}}
                                   options={regionList}
                                   defaultValue={get(vehicle, 'regionId')} label={'Регион регистрации'}
                                   type={'select'}
                                   name={'vehicle.regionId'}/>
                        </Col>
                        <Col xs={12} className={'mt-15'}>
                            <hr/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field params={{required: true}}
                                   options={regionList}
                                   defaultValue={get(vehicle, 'regionId')} label={'Пассажировместимость ТС'}
                                   type={'select'}
                                   name={'vehicle.regionId'}/>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </Section>
    </>);
};

export default CreateContainer;