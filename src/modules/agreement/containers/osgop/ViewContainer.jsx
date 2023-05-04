import React, {useEffect, useMemo, useState} from 'react';
import {find, get, head, isEqual, round, upperCase} from "lodash";
import Panel from "../../../../components/panel";
import Search from "../../../../components/search";
import {Col, Row} from "react-grid-system";
import Section from "../../../../components/section";
import Title from "../../../../components/ui/title";
import Button from "../../../../components/ui/button";
import Form from "../../../../containers/form/form";
import Flex from "../../../../components/flex";
import Field from "../../../../containers/form/field";
import {useDeleteQuery, useGetAllQuery, usePostQuery} from "../../../../hooks/api";
import {KEYS} from "../../../../constants/key";
import {URLS} from "../../../../constants/url";
import {getSelectOptionsListFromData} from "../../../../utils";
import {OverlayLoader} from "../../../../components/loader";
import {useNavigate} from "react-router-dom";
import {useStore} from "../../../../store";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";
import CarNumber from "../../../../components/car-number";
import Checkbox from "rc-checkbox";
import Table from "../../../../components/table";
import {Trash2} from "react-feather";


const ViewContainer = ({application_number = null}) => {
    const {t} = useTranslation()
    const navigate = useNavigate();
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [{
        id: 1, title: 'OSAGA list', path: '/osaga',
    }, {
        id: 2, title: 'OSAGA view', path: '/osaga',
    }], [])

    const [regionId, setRegionId] = useState(null)


    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])
    const {data, isLoading} = useGetAllQuery({
        key: KEYS.view,
        url: URLS.view,
        params: {
            params: {
                application_number: application_number
            }
        },
        enabled: !!(application_number)
    })

    const {data: filials, isLoading: isLoadingFilials} = useGetAllQuery({key: KEYS.agencies, url: URLS.agencies})
    const filialList = getSelectOptionsListFromData(get(filials, `data.result`, []), 'id', 'name')

    const {data: insuranceTerms, isLoading: isLoadingInsuranceTerms} = useGetAllQuery({
        key: KEYS.insuranceTerms, url: URLS.insuranceTerms
    })
    const insuranceTermsList = getSelectOptionsListFromData(get(insuranceTerms, `data.result`, []), 'id', 'name')

    const {data: termCategory, isLoading: isLoadingTermCategory} = useGetAllQuery({
        key: KEYS.termCategories, url: URLS.termCategories
    })
    const termCategoryList = getSelectOptionsListFromData(get(termCategory, `data.result`, []), 'id', 'name')

    const {data: accidentType, isLoading: isLoadingAccidentType} = useGetAllQuery({
        key: KEYS.accidentTypes, url: URLS.accidentTypes
    })
    const accidentTypeList = getSelectOptionsListFromData(get(accidentType, `data.result`, []), 'id', 'name')

    const {data: discounts, isLoading: isLoadingDiscount} = useGetAllQuery({
        key: KEYS.discounts, url: URLS.discounts
    })
    const discountList = getSelectOptionsListFromData(get(discounts, `data.result`, []), 'id', 'name')


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

    const {data: driverTypes} = useGetAllQuery({
        key: KEYS.driverTypes, url: URLS.driverTypes
    })
    const driverTypeList = getSelectOptionsListFromData(get(driverTypes, `data.result`, []), 'id', 'name')

    const {data: relatives} = useGetAllQuery({
        key: KEYS.relatives, url: URLS.relatives
    })
    const relativeList = getSelectOptionsListFromData(get(relatives, `data.result`, []), 'id', 'name')


    const {data: district} = useGetAllQuery({
        key: [KEYS.districts, regionId],
        url: URLS.districts,
        params: {
            params: {
                region: regionId
            }
        },
        enabled: !!(regionId)
    })
    const districtList = getSelectOptionsListFromData(get(district, `data.result`, []), 'id', 'name')

    const {data: agents} = useGetAllQuery({
        key: [KEYS.agents],
        url: URLS.agents,
        params: {
            params: {
                branch: null
            }
        },
    })
    const agentsList = getSelectOptionsListFromData(get(agents, `data.result`, []), 'id', 'name')


    const {
        mutate: sendFond, isLoading: isLoadingFond
    } = usePostQuery({listKeyId: KEYS.view})
    const {
        mutate: confirmPayedRequest, isLoading: isLoadingConfirmPayed
    } = usePostQuery({listKeyId: KEYS.view})

    const {mutate: deleteRequest, isLoading: deleteLoading} = useDeleteQuery({listKeyId: KEYS.delete})

    const send = () => {
        sendFond({
                url: `${URLS.send}?application_number=${application_number}`, attributes: {}
            },
            {
                onSuccess: ({data}) => {

                }
            }
        )
    }

    const confirmPayed = () => {
        confirmPayedRequest({
                url: URLS.confirmPayment, attributes: {
                    uuid: get(data, 'data.result.uuid'),
                    polisUuid: get(head(get(data, 'data.result.policies', [])), 'uuid'),
                    paidAt: dayjs(get(head(get(data, 'data.result.policies', [])), 'issueDate')).format("YYYY-MM-DD HH:mm:ss"),
                    insurancePremium: get(head(get(data, 'data.result.policies', [])), 'insurancePremium'),
                    startDate: get(head(get(data, 'data.result.policies', [])), 'startDate'),
                    endDate: get(head(get(data, 'data.result.policies', [])), 'endDate')
                }
            },
            {
                onSuccess: ({data}) => {

                }
            }
        )
    }

    const remove = () => {
        Swal.fire({
            position: 'center',
            icon: 'error',
            backdrop: 'rgba(0,0,0,0.9)',
            background: 'none',
            title: t('Are you sure?'),
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#13D6D1',
            confirmButtonText: t('Delete'),
            cancelButtonText: t('Cancel'),
            customClass: {
                title: 'title-color',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                deleteRequest({url: `${URLS.delete}?application_number=${application_number}`}, {
                    onSuccess: () => {
                        navigate('/osaga')
                    }
                })
            }
        });
    }

    if (isLoading || isLoadingAccidentType || isLoadingTermCategory || isLoadingRegion || isLoadingInsuranceTerms || isLoadingDiscount) {
        return <OverlayLoader/>
    }

    return (<>
        {(isLoadingFond || deleteLoading || isLoadingConfirmPayed) && <OverlayLoader/>}
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
            <Form footer={!isEqual(get(data, 'data.result.status'), 'payed') && <Flex className={'mt-32'}>{(isEqual(get(data, 'data.result.status'), 'new') || isEqual(get(data, 'data.result.status'), 'edited')) && <><Button onClick={remove}
                                                                                                                                                                                                                                danger type={'button'}
                                                                                                                                                                                                                                className={'mr-16'}>Удалить</Button>
                <Button onClick={() => navigate(`/osgor/update/${application_number}`)} yellow type={'button'}
                        className={'mr-16'}>Изменить</Button></>}
                <Button onClick={(isEqual(get(data, 'data.result.status'),'new') || isEqual(get(data, 'data.result.status'),'edited')) ? () =>send() : ()=>{}} gray={!(isEqual(get(data, 'data.result.status'),'new') || isEqual(get(data, 'data.result.status'),'edited'))} type={'button'} className={'mr-16'}>Отправить в
                    Фонд</Button>
                <Button onClick={isEqual(get(data, 'data.result.status'),'sent') ? ()=>confirmPayed():()=>{}}
                        type={'button'} gray={!isEqual(get(data, 'data.result.status'),'sent')} className={'mr-16'}>Подтвердить
                    оплату</Button></Flex>}>
                <Row gutterWidth={60} className={'mt-32'}>
                    <Col xs={4} style={{borderRight: '1px solid #DFDFDF'}}>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Статус</Col>
                            <Col xs={7}><Button green>Новый</Button></Col>
                        </Row>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Филиал </Col>
                            <Col xs={7}><Field disabled defaultValue={get(data, 'data.result.agencyId')}
                                               label={'Filial'} params={{required: true}} options={filialList}
                                               property={{hideLabel: true}} type={'select'}
                                               name={'agencyId'}/></Col>
                        </Row>

                        {/*<Row align={'center'} className={'mb-25'}>*/}
                        {/*    <Col xs={5}>Наличие страховых случаев:</Col>*/}
                        {/*    <Col xs={7}><Field options={accidentTypeList} defaultValue={get(data, 'data.result.agencyId')} params={{required: true}}*/}
                        {/*                       label={'Accident type'} property={{hideLabel: true}}*/}
                        {/*                       type={'select'}*/}
                        {/*                       name={'accident'}/></Col>*/}
                        {/*</Row>*/}
                    </Col>
                    <Col xs={4}>

                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Страховая сумма: </Col>
                            <Col xs={7}><Field defaultValue={get(data, 'data.result.cost.sumInsured')}
                                               property={{hideLabel: true, disabled: true}}
                                               type={'number-format-input'}
                                               name={'policies[0].insuranceSum'}/></Col>
                        </Row>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Страховая премия: </Col>
                            <Col xs={7}><Field defaultValue={get(data, 'data.result.cost.insurancePremium')}
                                               property={{hideLabel: true, disabled: true}}
                                               type={'number-format-input'}
                                               name={'policies[0].insurancePremium'}/></Col>
                        </Row>
                    </Col>
                    <Col xs={4}>

                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Дата начала покрытия: </Col>
                            <Col xs={7}><Field
                                disabled
                                defaultValue={get(data, 'data.result.details.startDate')}
                                params={{required: true}}
                                property={{hideLabel: true}}
                                type={'datepicker'}
                                name={'details.startDate'}/></Col>
                        </Row>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Дача окончания покрытия: </Col>
                            <Col xs={7}><Field
                                disabled
                                defaultValue={get(data, 'data.result.details.endDate')}
                                property={{hideLabel: true}}
                                type={'datepicker'}
                                name={'details.endDate'}/></Col>
                        </Row>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Дата выдачи полиса: </Col>
                            <Col xs={7}><Field disabled
                                               defaultValue={get(data, 'data.result.details.issueDate')}
                                               property={{hideLabel: true}} type={'datepicker'}
                                               name={'details.issueDate'}/></Col>
                        </Row>
                        {/*<Row align={'center'} className={'mb-25'}>*/}
                        {/*    <Col xs={5}>Наличие льгот:</Col>*/}
                        {/*    <Col xs={7}><Field options={discountList} params={{required: true}}*/}
                        {/*                       label={'Discounts'} property={{hideLabel: true}}*/}
                        {/*                       type={'select'}*/}
                        {/*                       name={'discount'}/></Col>*/}
                        {/*</Row>*/}
                    </Col>
                </Row>
                <Row gutterWidth={60} className={'mt-30'}>
                    <Col xs={12} className={'mb-25'}><Title>Транспортное средство</Title></Col>
                    <Col xs={4} style={{borderRight: '1px solid #DFDFDF'}}>
                        <div className={'mb-15'}>Государственный номер</div>
                        <div className={'mb-25'}><CarNumber disabled
                                                            defaultValue={get(data, 'data.result.vehicle.govNumber')}
                                                            getGovNumber={() => {
                                                            }}/></div>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Серия тех.паспорта:</Col>
                            <Col xs={7}><Field defaultValue={get(data, 'data.result.vehicle.techPassport.seria')}
                                               property={{hideLabel: true, disabled: true}}
                                               type={'input'}
                                               name={'vehicle.techPassport.seria'}/></Col>
                        </Row>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Номер тех.паспорта:</Col>
                            <Col xs={7}><Field defaultValue={get(data, 'data.result.vehicle.techPassport.number')}
                                               property={{hideLabel: true, disabled: true}}
                                               type={'input'}
                                               name={'vehicle.techPassport.number'}/></Col>
                        </Row>

                    </Col>
                    <Col xs={8}>
                        <Row>
                            <Col xs={4} className="mb-25">
                                <Field disabled defaultValue={get(data, 'data.result.vehicle.regionId')}
                                       options={regionList}
                                       params={{required: true}}
                                       label={'Территория пользования'}
                                       type={'select'}
                                       name={'vehicle.regionId'}/>
                            </Col>
                            <Col xs={4} className="mb-25">
                                <Field property={{disabled: true}}
                                       defaultValue={get(data, 'data.result.vehicle.modelCustomName')}
                                       params={{required: true}}
                                       label={'Марка / модель'}
                                       type={'input'}
                                       name={'vehicle.modelCustomName'}/>
                            </Col>
                            <Col xs={4} className="mb-25">
                                <Field disabled defaultValue={get(data, 'data.result.vehicle.typeId')}
                                       options={vehicleTypeList}
                                       params={{required: true}}
                                       label={'Вид транспорта'}
                                       type={'select'}
                                       name={'vehicle.typeId'}/>
                            </Col>
                            <Col xs={4} className="mb-25">
                                <Field disabled defaultValue={get(data, 'data.result.vehicle.issueYear')}
                                       property={{mask: '9999', maskChar: '_'}} params={{required: true}}
                                       label={'Год'}
                                       type={'input-mask'}
                                       name={'vehicle.issueYear'}/>
                            </Col>
                            <Col xs={4} className="mb-25">
                                <Field property={{disabled: true}}
                                       defaultValue={get(data, 'data.result.vehicle.bodyNumber')}
                                       params={{required: true}}
                                       label={'Номер кузова (шасси)'}
                                       type={'input'}
                                       name={'vehicle.bodyNumber'}/>
                            </Col>
                            <Col xs={4} className="mb-25">
                                <Field property={{disabled: true}}
                                       defaultValue={get(data, 'data.result.vehicle.engineNumber')}
                                       params={{required: true}}
                                       label={'Номер двигателя'}
                                       type={'input'}
                                       name={'vehicle.engineNumber'}/>
                            </Col>
                            <Col xs={4} className="mb-25">
                                <Field property={{disabled: true}}
                                       defaultValue={get(data, 'data.result.vehicle.fullWeight')}
                                       params={{required: true}}
                                       label={'Объем'}
                                       type={'input'}
                                       name={'vehicle.fullWeight'}/>
                            </Col>
                            <Col xs={4} className="mb-25">
                                <Field disabled defaultValue={get(data, 'data.result.vehicle.techPassport.issueDate')}
                                       params={{required: true}}
                                       label={'Дата выдачи тех.паспорта'}
                                       type={'datepicker'}
                                       name={'vehicle.techPassport.issueDate'}/>
                            </Col>
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
                                    <Button
                                        gray={!get(data, 'data.result.owner.person')} className={'mr-16'}
                                        type={'button'}>Физ. лицо</Button>
                                    <Button
                                        gray={!get(data, 'data.result.owner.organization')} type={'button'}>Юр.
                                        лицо</Button>
                                </Flex>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12}>
                        <hr className={'mt-15 mb-15'}/>
                    </Col>
                    {get(data, 'data.result.owner.person') && <>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}} params={{required: true}}
                                   defaultValue={get(data, 'data.result.owner.person.fullName.firstname')}
                                   label={'Firstname'}
                                   type={'input'}
                                   name={'owner.person.fullName.firstname'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}} params={{required: true}}
                                   defaultValue={get(data, 'data.result.owner.person.fullName.lastname')}
                                   label={'Lastname'}
                                   type={'input'}
                                   name={'owner.person.fullName.lastname'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}} params={{required: true}}
                                   defaultValue={get(data, 'data.result.owner.person.fullName.middlename')}
                                   label={'Middlename'}
                                   type={'input'}
                                   name={'owner.person.fullName.middlename'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}} params={{required: true}}
                                   defaultValue={get(data, 'data.result.owner.person.passportData.pinfl')}
                                   label={'ПИНФЛ'} type={'input'}
                                   name={'owner.person.passportData.pinfl'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field disabled params={{required: true}} property={{
                                mask: 'aa',
                                placeholder: 'AA',
                                maskChar: '_'
                            }} defaultValue={get(data, 'data.result.owner.person.passportData.seria')}
                                   label={'Passport seria'} type={'input-mask'}
                                   name={'owner.person.passportData.seria'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field disabled params={{required: true}} property={{
                                mask: '9999999',
                                placeholder: '1234567',
                                maskChar: '_'
                            }} defaultValue={get(data, 'data.result.owner.person.passportData.number')}
                                   label={'Passport number'} type={'input-mask'}
                                   name={'owner.person.passportData.number'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field disabled params={{required: true}}
                                   defaultValue={get(data, 'data.result.owner.person.issueDate')}
                                   label={'Issue date'}
                                   type={'datepicker'}
                                   name={'owner.person.passportData.issueDate'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}} params={{required: true}}
                                   defaultValue={get(data, 'data.result.owner.person.passportData.issuedBy')}
                                   label={'Issued by'}
                                   type={'input'}
                                   name={'owner.person.passportData.issuedBy'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field disabled params={{required: true}}
                                   defaultValue={get(data, 'data.result.owner.person.birthDate')}
                                   label={'Birth date'}
                                   type={'datepicker'}
                                   name={'owner.person.birthDate'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                defaultValue={get(data, 'data.result.owner.person.gender')}
                                options={genderList}
                                label={'Gender'}
                                type={'select'}
                                name={'owner.person.gender'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                property={{disabled: true}}
                                defaultValue={get(data, 'data.result.owner.person.birthCountryCode')}
                                label={'Country'}
                                type={'input'}
                                name={'owner.person.birthCountryCode'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                params={{required: true}}
                                options={regionList}
                                defaultValue={get(data, 'data.result.owner.person.regionId')}
                                label={'Region'}
                                type={'select'}
                                name={'owner.person.regionId'}/>
                        </Col>
                        {/*<Col xs={3} className={'mb-25'}>*/}
                        {/*    <Field*/}
                        {/*        disabled*/}
                        {/*        params={{required: true}}*/}
                        {/*        options={districtList}*/}
                        {/*        defaultValue={get(data,'data.result.owner.person.districtId')}*/}
                        {/*        label={'District'}*/}
                        {/*        type={'select'}*/}
                        {/*        name={'owner.person.districtId'}/>*/}
                        {/*</Col>*/}
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                options={residentTypeList}
                                defaultValue={get(data, 'data.result.owner.person.residentType')}
                                label={'Resident type'}
                                type={'select'}
                                name={'owner.person.residentType'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                property={{disabled: true}}
                                label={'Address'}
                                type={'input'}
                                defaultValue={get(data, 'data.result.owner.person.address')}
                                name={'owner.person.address'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                property={{disabled: true}}
                                params={{required: true}}
                                defaultValue={get(data, 'data.result.owner.person.phone')}
                                label={'Phone'}
                                type={'input'}
                                name={'owner.person.phone'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                property={{disabled: true}}
                                defaultValue={get(data, 'data.result.owner.person.email')}
                                label={'Email'}
                                type={'input'}
                                name={'owner.person.email'}/>
                        </Col>
                    </>}
                    {isEqual(data, 'data.result.owner') && <>
                        <Col xs={3} className={'mb-25'}>
                            <Field disabled params={{required: true}} label={'INN'}
                                   defaultValue={get(data, 'data.result.owner.organization.inn')} property={{
                                mask: '999999999',
                                placeholder: 'Inn',
                                maskChar: '_'
                            }} name={'owner.organization.inn'} type={'input-mask'}/>

                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}} params={{required: true}}
                                   defaultValue={get(data, 'data.result.owner.organization.name')}
                                   label={'Наименование'} type={'input'}
                                   name={'owner.organization.name'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}}
                                   defaultValue={get(data, 'data.result.owner.organization.representativeName')}
                                   label={'Руководитель'} type={'input'}
                                   name={'owner.organization.representativeName'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}}
                                   defaultValue={get(data, 'data.result.owner.organization.position')}
                                   label={'Должность'} type={'input'}
                                   name={'owner.organization.position'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}}
                                   defaultValue={get(data, 'data.result.owner.organization.phone')}
                                   params={{required: true}}
                                   label={'Телефон'} type={'input'}
                                   name={'owner.organization.phone'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}}
                                   defaultValue={get(data, 'data.result.owner.organization.email')} label={'Email'}
                                   type={'input'}
                                   name={'owner.organization.email'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}}
                                   defaultValue={get(data, 'data.result.owner.organization.checkingAccount')}
                                   label={'Расчетный счет'} type={'input'}
                                   name={'owner.organization.checkingAccount'}/>
                        </Col>
                        <Col xs={3}><Field disabled
                                           defaultValue={get(data, 'data.result.owner.organization.checkingAccount')}
                                           label={'Область'} params={{required: true}} options={regionList}
                                           type={'select'}
                                           name={'owner.organization.regionId'}/></Col>
                        <Col xs={3}><Field disabled
                                           defaultValue={get(data, 'data.result.owner.organization.checkingAccount')}
                                           label={'Форма собственности'} params={{required: true}}
                                           options={[]}
                                           type={'select'}
                                           name={'owner.organization.ownershipFormId'}/></Col>
                    </>}
                    <Col xs={12} className={'mt-15'}><Checkbox disabled
                                                               checked={get(data, 'data.result.owner.applicantIsOwner')}
                                                               className={'mr-5'}/><strong>Собственник является
                        Заявителем</strong></Col>
                </Row>
                <Row gutterWidth={60} className={'mt-30'}>
                    <Col xs={12} className={'mb-25'}><Title>Заявитель </Title></Col>
                    <Col xs={12}>
                        <Row>
                            <Col xs={12}>
                                <Flex>
                                    <h4 className={'mr-16'}>Заявитель </h4>
                                    <Button
                                        gray={!get(data, 'data.result.applicant.person')}
                                        className={'mr-16'}
                                        type={'button'}>Физ. лицо</Button>
                                    <Button
                                        gray={!get(data, 'data.result.applicant.organization')}
                                        type={'button'}>Юр.
                                        лицо</Button>
                                </Flex>
                            </Col>

                        </Row>
                    </Col>
                    <Col xs={12}>
                        <hr className={'mt-15 mb-15'}/>
                    </Col>
                    {get(data, 'data.result.applicant.person') && <>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                property={{disabled: true}}
                                params={{required: true}}
                                defaultValue={get(data, 'data.result.applicant.person.fullName.firstname')}
                                label={'Firstname'}
                                type={'input'}
                                name={'applicant.person.fullName.firstname'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                property={{disabled: true}}
                                params={{required: true}}
                                defaultValue={get(data, 'data.result.applicant.person.fullName.lastname')}
                                label={'Lastname'}
                                type={'input'}
                                name={'applicant.person.fullName.lastname'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                property={{disabled: true}}
                                params={{required: true}}
                                defaultValue={get(data, 'data.result.applicant.person.fullName.middlename')}
                                label={'Middlename'}
                                type={'input'}
                                name={'applicant.person.fullName.middlename'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field params={{required: true}}
                                   property={{disabled: true}}
                                   defaultValue={get(data, 'data.result.applicant.person.passportData.pinfl')}
                                   label={'ПИНФЛ'} type={'input'}
                                   name={'applicant.person.passportData.pinfl'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field disabled params={{required: true}} property={{
                                mask: 'aa',
                                placeholder: 'AA',
                                maskChar: '_'
                            }} defaultValue={get(data, 'data.result.applicant.person.passportData.seria')}
                                   label={'Passport seria'} type={'input-mask'}
                                   name={'applicant.person.passportData.seria'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                params={{required: true}}
                                property={{
                                    mask: '9999999',
                                    placeholder: '1234567',
                                    maskChar: '_'
                                }} defaultValue={get(data, 'data.result.applicant.person.passportData.number')}
                                label={'Passport number'} type={'input-mask'}
                                name={'applicant.person.passportData.number'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                defaultValue={get(data, 'data.result.applicant.person.passportData.issueDate')}
                                params={{required: true}}
                                label={'Issue date'} type={'datepicker'}
                                name={'applicant.person.passportData.issueDate'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}} params={{required: true}}
                                   defaultValue={get(data, 'data.result.applicant.person.passportData.issuedBy')}
                                   label={'Issued by'}
                                   type={'input'}
                                   name={'applicant.person.passportData.issuedBy'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                defaultValue={get(data, 'data.result.applicant.person.birthDate')}
                                label={'Birth date'}
                                type={'datepicker'}
                                name={'applicant.person.birthDate'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                defaultValue={get(data, 'data.result.applicant.person.gender')}
                                options={genderList}
                                label={'Gender'}
                                type={'select'}
                                name={'applicant.person.gender'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                property={{disabled: true}}
                                defaultValue={get(data, 'data.result.applicant.person.birthCountryCode')}
                                label={'Country'}
                                type={'input'}
                                name={'applicant.person.birthCountryCode'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                options={regionList}
                                defaultValue={get(data, 'data.result.applicant.person.regionId')}
                                label={'Region'}
                                type={'select'}
                                name={'applicant.person.regionId'}/>
                        </Col>

                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                options={residentTypeList}
                                defaultValue={get(data, 'data.result.applicant.person.residentType')}
                                label={'Resident type'}
                                type={'select'}
                                name={'applicant.person.residentType'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                property={{disabled: true}}
                                defaultValue={get(data, 'data.result.applicant.person.districtId')}
                                label={'Address'}
                                type={'input'}
                                name={'applicant.person.address'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                property={{disabled: true}}
                                defaultValue={get(data, 'data.result.applicant.person.phoneNumber')}
                                label={'Phone'}
                                type={'input'}
                                name={'applicant.person.phoneNumber'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                property={{disabled: true}}
                                defaultValue={get(data, 'data.result.applicant.person.email')}
                                label={'Email'}
                                type={'input'}
                                name={'applicant.person.email'}/>
                        </Col>
                    </>}
                    {get(data, 'data.result.applicant.organization') && <>
                        <Col xs={3} className={'mb-25'}>
                            <Field params={{required: true}} label={'INN'}
                                   defaultValue={get(data, 'data.result.applicant.person.inn')} property={{
                                mask: '999999999',
                                placeholder: 'Inn',
                                maskChar: '_'
                            }} name={'applicant.organization.inn'} type={'input-mask'}/>

                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field params={{required: true}}
                                   defaultValue={get(data, 'data.result.applicant.person.name')}
                                   label={'Наименование'} type={'input'}
                                   name={'applicant.organization.name'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field label={'Руководитель'} type={'input'}
                                   name={'applicant.organization.representativeName'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field label={'Должность'} type={'input'}
                                   name={'applicant.organization.position'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                property={{disabled: true}}
                                defaultValue={get(data, 'data.result.applicant.organization.phone')}
                                params={{required: true}}
                                label={'Телефон'} type={'input'}
                                name={'applicant.organization.phone'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                property={{disabled: true}}
                                defaultValue={get(data, 'data.result.applicant.organization.email')}
                                label={'Email'} type={'input'}
                                name={'applicant.organization.email'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field label={'Расчетный счет'} type={'input'}
                                   name={'applicant.organization.checkingAccount'}/>
                        </Col>
                        <Col xs={3}><Field label={'Область'} params={{required: true}} options={regionList}
                                           type={'select'}
                                           name={'applicant.organization.regionId'}/></Col>
                        <Col xs={3}><Field label={'Форма собственности'} params={{required: true}}
                                           options={[]}
                                           type={'select'}
                                           name={'applicant.organization.ownershipFormId'}/></Col>
                    </>}
                </Row>
                <Row gutterWidth={60} className={'mt-30'}>
                    <Col xs={12} className={'mb-25'}><Title>Водители / Родственники</Title></Col>
                    <Col xs={12}>
                        <div className={'horizontal-scroll '}>
                            <Table bordered hideThead={false}
                                   thead={['Фамилия ', 'Имя', 'Отчество', 'Сария паспорта', 'Номер паспорта', 'Pinfl', 'Дата паспорта', 'Серия вод.удостоверения', 'Номер вод.удостоверения', 'Дата вод.удостоверения', 'Степень родства']}>
                                {
                                    get(data,'data.result.drivers',[]).map((item, index) => <tr>
                                        <td>{get(item, 'fullName.lastname')}</td>
                                        <td>{get(item, 'fullName.firstname')}</td>
                                        <td>{get(item, 'fullName.middlename')}</td>
                                        <td>{upperCase(get(item, 'passportData.seria', ''))}</td>
                                        <td>{get(item, 'passportData.number')}</td>
                                        <td>{get(item, 'passportData.pinfl')}</td>
                                        <td>{get(item, 'passportData.issueDate')}</td>
                                        <td>{get(item, 'licenseSeria')}</td>
                                        <td>{get(item, 'licenseNumber')}</td>
                                        <td>{get(item, 'licenseIssueDate')}</td>
                                        <td>{get(find(relativeList, (r) => get(r, 'value') == get(item, 'relative')), 'label')}</td>
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
                                    disabled
                                    defaultValue={get(data,'data.result.agentId')}
                                    options={[{label: t('No agent'), value: undefined}, ...agentsList]}
                                    label={'Агент'}
                                    type={'select'}
                                    name={'agentId'}/>
                            </Col>

                            <Col xs={6} className={'mb-25'}>
                                <Field
                                    params={{required: true}}
                                    property={{type: 'number', disabled: true}}
                                    defaultValue={20}
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
                                    name={'rpmPercent'}/>
                            </Col>
                            <Col xs={6} className={'mb-25'}>
                                <Field
                                    defaultValue={round(get(data,'data.result.agentReward',20) * get(data,'data.result.cost.insurancePremium',0) / 100, 2)}
                                    property={{disabled: true}}
                                    label={'Сумма'}
                                    type={'number-format-input'}
                                    name={'rewardSum'}/>
                            </Col>
                            <Col xs={6} className={'mb-25'}>
                                <Field
                                    defaultValue={round(5 * get(data,'data.result.cost.insurancePremium',0)  / 100, 2)}
                                    property={{disabled: true}}
                                    label={'Сумма'}
                                    type={'number-format-input'}
                                    name={'rpmSum'}/>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>
        </Section>
    </>);
};

export default ViewContainer;