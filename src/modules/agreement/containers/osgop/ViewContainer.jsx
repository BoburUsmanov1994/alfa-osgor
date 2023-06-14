import React, {useEffect, useMemo, useState} from 'react';
import {find, get, head, isEqual, round} from "lodash";
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
import Checkbox from "rc-checkbox";


const ViewContainer = ({osgop_formId = null}) => {
    const {t} = useTranslation()
    const navigate = useNavigate();
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [{
        id: 1, title: 'OSAGA list', path: '/osaga',
    }, {
        id: 2, title: 'OSAGA view', path: '/osaga',
    }], [])


    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])
    const {data, isLoading} = useGetAllQuery({
        key: KEYS.osgopView,
        url: URLS.osgopView,
        params: {
            params: {
                osgop_formId: osgop_formId
            }
        },
        enabled: !!(osgop_formId)
    })

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

    const {data: country, isLoading: isLoadingCountry} = useGetAllQuery({
        key: KEYS.countries, url: URLS.countries
    })
    const countryList = getSelectOptionsListFromData(get(country, `data.result`, []), 'id', 'name')

    const {data: areaTypes} = useGetAllQuery({
        key: KEYS.areaTypes, url: URLS.areaTypes
    })
    const areaTypesList = getSelectOptionsListFromData(get(areaTypes, `data.result`, []), 'id', 'name')

    const {data: ownershipForms} = useGetAllQuery({
        key: KEYS.ownershipForms, url: URLS.ownershipForms
    })
    const ownershipFormList = getSelectOptionsListFromData(get(ownershipForms, `data.result`, []), 'id', 'name')


    const {data: agents} = useGetAllQuery({
        key: [KEYS.agents],
        url: URLS.agents,
        params: {
            params: {
                branch: get(data, 'data.result.agencyId')
            }
        },
    })
    const agentsList = getSelectOptionsListFromData(get(agents, `data.result`, []), 'id', 'name')

    const {data: okeds} = useGetAllQuery({
        key: KEYS.okeds, url: URLS.okeds
    })
    const okedList = getSelectOptionsListFromData(get(okeds, `data.result`, []), 'id', 'name')


    const {
        mutate: sendFond, isLoading: isLoadingFond
    } = usePostQuery({listKeyId: KEYS.osgopView})
    const {
        mutate: confirmPayedRequest, isLoading: isLoadingConfirmPayed
    } = usePostQuery({listKeyId: KEYS.osgopView})

    const {mutate: deleteRequest, isLoading: deleteLoading} = useDeleteQuery({listKeyId: KEYS.osgopDelete})

    const send = () => {
        sendFond({
                url: `${URLS.osgopSendFond}?osgop_formId=${osgop_formId}`, attributes: {}
            },
            {
                onSuccess: ({data}) => {

                }
            }
        )
    }

    const confirmPayed = () => {
        confirmPayedRequest({
                url: URLS.osgopConfirmPayment, attributes: {
                    uuid: get(data, 'data.result.uuid'),
                    paidAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    insurancePremium: get(data, 'data.result.premium', 0),
                    startDate: get(data, 'data.result.contractStartDate'),
                    endDate: get(data, 'data.result.contractEndDate')
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
                deleteRequest({url: `${URLS.delete}?osgop_formId=${osgop_formId}`}, {
                    onSuccess: () => {
                        navigate('/osgop')
                    }
                })
            }
        });
    }

    if (isLoading || isLoadingRegion || isLoadingInsuranceTerms || isLoadingCountry) {
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
            <Form footer={!isEqual(get(data, 'data.result.status'), 'payed') && <Flex
                className={'mt-32'}>{(isEqual(get(data, 'data.result.status'), 'new') || isEqual(get(data, 'data.result.status'), 'edited')) && <>
                <Button onClick={remove}
                        danger type={'button'}
                        className={'mr-16'}>Удалить</Button>
                <Button onClick={() => navigate(`/osgop/update/${osgop_formId}`)} yellow type={'button'}
                        className={'mr-16'}>Изменить</Button></>}
                <Button
                    onClick={(isEqual(get(data, 'data.result.status'), 'new') || isEqual(get(data, 'data.result.status'), 'edited')) ? () => send() : () => {
                    }}
                    gray={!(isEqual(get(data, 'data.result.status'), 'new') || isEqual(get(data, 'data.result.status'), 'edited'))}
                    type={'button'} className={'mr-16'}>Отправить в
                    Фонд</Button>
                <Button onClick={isEqual(get(data, 'data.result.status'), 'sent') ? () => confirmPayed() : () => {
                }}
                        type={'button'} gray={!isEqual(get(data, 'data.result.status'), 'sent')} className={'mr-16'}>Подтвердить
                    оплату</Button></Flex>}>
                <Row gutterWidth={60} className={'mt-32'}>
                    <Col xs={4} style={{borderRight: '1px solid #DFDFDF'}}>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Статус</Col>
                            <Col xs={7}><Button green>{get(data, 'data.result.status')}</Button></Col>
                        </Row>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Филиал </Col>
                            <Col xs={7}><Field defaultValue={get(data, 'data.result.agencyId')} disabled
                                               params={{required: true}} options={filialList}
                                               property={{hideLabel: true}} type={'select'}
                                               name={'agencyId'}/></Col>
                        </Row>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Серия договора:</Col>
                            <Col xs={7}><Field defaultValue={get(data, 'data.result.seria')}
                                               property={{hideLabel: true, disabled: true}} type={'input'}
                                               name={'seria'}/></Col>
                        </Row>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Номер договора: </Col>
                            <Col xs={7}><Field defaultValue={get(data, 'data.result.number')}
                                               params={{required: true}}
                                               property={{hideLabel: true, disabled: true}}
                                               type={'input'}
                                               name={'number'}/></Col>
                        </Row>

                    </Col>
                    <Col xs={4}>

                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Страховая сумма: </Col>
                            <Col xs={7}><Field defaultValue={get(data, 'data.result.sum', 0)}
                                               property={{hideLabel: true, disabled: true}}
                                               type={'number-format-input'}
                                               name={'policies[0].insuranceSum'}/></Col>
                        </Row>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Страховая премия: </Col>
                            <Col xs={7}><Field defaultValue={get(data, 'data.result.premium', 0)}
                                               property={{hideLabel: true, disabled: true}}
                                               type={'number-format-input'}
                                               name={'policies[0].insurancePremium'}/></Col>
                        </Row>
                    </Col>
                    <Col xs={4}>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Срок страхования:</Col>
                            <Col xs={7}><Field disabled
                                               defaultValue={get(data, 'data.result.insuranceTermId')}
                                               options={insuranceTermsList} params={{required: true}}
                                               label={'Insurance term'} property={{hideLabel: true}}
                                               type={'select'}
                                               name={'policies[0].insuranceTermId'}/></Col>
                        </Row>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Дата начала покрытия: </Col>
                            <Col xs={7}><Field
                                defaultValue={get(data, 'data.result.contractStartDate')} disabled
                                property={{
                                    hideLabel: true,
                                    dateFormat: 'dd.MM.yyyy'
                                }}
                                type={'datepicker'}
                                name={'policies[0].startDate'}/></Col>
                        </Row>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Дача окончания покрытия: </Col>
                            <Col xs={7}><Field
                                defaultValue={get(data, 'data.result.contractEndDate')} disabled
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
                                    <Button
                                        gray={!get(data, 'data.result.owner.person')} className={'mr-16'}
                                        type={'button'}>Физ. лицо</Button>
                                    <Button
                                        gray={!get(data, 'data.result.owner.organization')} type={'button'}>Юр.
                                        лицо</Button>
                                </Flex>
                            </Col>
                            <Col xs={8} className={'text-right'}>
                                {get(data, 'data.result.owner.person') && <Flex justify={'flex-end'}>
                                    <Field
                                        defaultValue={get(data, 'data.result.owner.person.passportData.seria')}
                                        disabled
                                        className={'mr-16'} style={{width: 75}}
                                        property={{
                                            hideLabel: true,
                                            mask: 'aa',
                                            placeholder: 'AA',
                                            maskChar: '_',
                                            disabled: true
                                        }}
                                        name={'passportSeries'}
                                        type={'input-mask'}
                                    />
                                    <Field
                                        defaultValue={get(data, 'data.result.owner.person.passportData.number')}
                                        disabled
                                        property={{
                                            hideLabel: true,
                                            mask: '9999999',
                                            placeholder: '1234567',
                                            maskChar: '_'
                                        }} name={'passportNumber'} type={'input-mask'}/>

                                    <Field className={'ml-15'}
                                           defaultValue={get(data, 'data.result.owner.person.birthDate')}
                                           disabled
                                           property={{
                                               hideLabel: true,
                                               placeholder: 'Дата рождения',
                                           }}
                                           name={'birthDate'} type={'datepicker'}/>
                                </Flex>}
                                {get(data, 'data.result.owner.organization') && <Flex justify={'flex-end'}>
                                    <Field disabled defaultValue={get(data, 'data.result.owner.organization.inn')}
                                           property={{
                                               hideLabel: true,
                                               mask: '999999999',
                                               placeholder: 'Inn',
                                               maskChar: '_'
                                           }} name={'inn'} type={'input-mask'}/>
                                </Flex>}
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12}>
                        <hr className={'mt-15 mb-15'}/>
                    </Col>
                    {get(data, 'data.result.owner.person') && <>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                property={{disabled: true}}
                                params={{required: true}}
                                defaultValue={get(data, 'data.result.owner.person.fullName.firstname')}
                                label={'Firstname'}
                                type={'input'}
                                name={'insurant.person.fullName.firstname'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}} params={{required: true}}
                                   defaultValue={get(data, 'data.result.owner.person.fullName.lastname')}
                                   label={'Lastname'}
                                   type={'input'}
                                   name={'insurant.person.fullName.lastname'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}}
                                   defaultValue={get(data, 'data.result.owner.person.fullName.middlename')}
                                   params={{required: true}}
                                   label={'Middlename'}
                                   type={'input'}
                                   name={'insurant.person.fullName.middlename'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}} params={{required: true}}
                                   defaultValue={get(data, 'data.result.owner.person.passportData.pinfl')}
                                   label={'ПИНФЛ'} type={'input'}
                                   name={'insurant.person.passportData.pinfl'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field disabled defaultValue={get(data, 'data.result.owner.person.passportData.seria')}
                                   params={{required: true}} property={{
                                mask: 'aa',
                                placeholder: 'AA',
                                maskChar: '_'
                            }} label={'Passport seria'} type={'input-mask'}
                                   name={'insurant.person.passportData.seria'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field disabled defaultValue={get(data, 'data.result.owner.person.passportData.number')}
                                   params={{required: true}} property={{
                                mask: '9999999',
                                placeholder: '1234567',
                                maskChar: '_'
                            }} label={'Passport number'} type={'input-mask'}
                                   name={'insurant.person.passportData.number'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field disabled params={{required: true}}
                                   defaultValue={dayjs(get(data, 'data.result.owner.person.birthDate')).toDate()}
                                   label={'Birth date'}
                                   type={'datepicker'}
                                   name={'insurant.person.birthDate'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                defaultValue={get(data, 'data.result.owner.person.gender')}
                                options={genderList}
                                label={'Gender'}
                                type={'select'}
                                name={'insurant.person.gender'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                defaultValue={get(data, 'data.result.owner.person.countryId')}
                                label={'Country'}
                                type={'select'}
                                options={countryList}
                                name={'insurant.person.countryId'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                params={{required: true}}
                                options={regionList}
                                defaultValue={get(data, 'data.result.regionId')}
                                label={'Region'}
                                type={'select'}
                                name={'insurant.person.regionId'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                options={residentTypeList}
                                defaultValue={get(data, 'data.result.owner.person.residentType')}
                                label={'Resident type'}
                                type={'select'}
                                name={'insurant.person.residentType'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                property={{disabled: true}}
                                defaultValue={get(data, 'data.result.owner.person.address')}
                                label={'Address'}
                                type={'input'}
                                name={'insurant.person.address'}/>
                        </Col>
                        <Col xs={3}>
                            <Field
                                disabled
                                params={{required: true}}
                                options={areaTypesList}
                                defaultValue={get(data, 'data.result.areaTypeId')}
                                label={'Тип местности'}
                                type={'select'}
                                name={'insurant.person.areaTypeId'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                property={{disabled: true}}
                                params={{required: true}}
                                defaultValue={get(data, 'data.result.owner.person.phone')}
                                label={'Phone'}
                                type={'input'}
                                name={'insurant.person.phone'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                property={{disabled: true}}
                                defaultValue={get(data, 'data.result.owner.person.email')}
                                label={'Email'}
                                type={'input'}
                                name={'insurant.person.email'}/>
                        </Col>
                    </>}
                    {get(data, 'data.result.owner.organization') && <>
                        <Col xs={3} className={'mb-25'}>
                            <Field disabled params={{required: true}} label={'INN'}
                                   defaultValue={get(data, 'data.result.owner.organization.inn')} property={{
                                mask: '999999999',
                                placeholder: 'Inn',
                                maskChar: '_'
                            }} name={'insurant.organization.inn'} type={'input-mask'}/>

                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}} params={{required: true}}
                                   defaultValue={get(data, 'data.result.owner.organization.name')}
                                   label={'Наименование'} type={'input'}
                                   name={'insurant.organization.name'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}}
                                   defaultValue={get(data, 'data.result.owner.organization.representativeName')}
                                   label={'Руководитель'} type={'input'}
                                   name={'insurant.organization.representativeName'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}}
                                   defaultValue={get(data, 'data.result.owner.organization.position')}
                                   label={'Должность'} type={'input'}
                                   name={'insurant.organization.position'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}}
                                   defaultValue={get(data, 'data.result.owner.organization.phone')}
                                   params={{required: true}}
                                   label={'Телефон'} type={'input'}
                                   name={'insurant.organization.phone'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}}
                                   defaultValue={get(data, 'data.result.owner.organization.email')} label={'Email'}
                                   type={'input'}
                                   name={'insurant.organization.email'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}}
                                   defaultValue={get(data, 'data.result.owner.organization.checkingAccount')}
                                   label={'Расчетный счет'} type={'input'}
                                   name={'insurant.organization.checkingAccount'}/>
                        </Col>
                        <Col xs={3}><Field defaultValue={get(data, 'data.result.owner.organization.regionId')} disabled
                                           label={'Область'} params={{required: true}} options={regionList}
                                           type={'select'}
                                           name={'insurant.organization.regionId'}/></Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                property={{disabled: true}}
                                defaultValue={get(data, 'data.result.owner.organization.address')}
                                label={'Address'}
                                type={'input'}
                                name={'insurant.organization.address'}/>
                        </Col>
                        <Col xs={3}><Field disabled
                                           defaultValue={get(data, 'data.result.owner.organization.ownershipFormId')}
                                           label={'Форма собственности'} params={{required: true}}
                                           options={ownershipFormList}
                                           type={'select'}
                                           name={'insurant.organization.ownershipFormId'}/></Col>
                        <Col xs={3}>
                            <Field
                                disabled
                                params={{required: true}}
                                options={areaTypesList}
                                defaultValue={get(data, 'data.result.owner.organization.areaTypeId')}
                                label={'Тип местности'}
                                type={'select'}
                                name={'insurant.organization.areaTypeId'}/>
                        </Col>
                        <Col xs={3}><Field disabled
                                           defaultValue={parseInt(get(data, 'data.result.owner.organization.oked'))}
                                           label={'Oked'} params={{required: true}}
                                           options={okedList}
                                           type={'select'}
                                           name={'insurant.organization.oked'}/></Col>
                    </>}
                    <Col xs={12} className={'mt-15'}><Checkbox disabled
                                                               checked={get(data, 'data.result.insurantIsOwner')}
                                                               className={'mr-5'}/><strong>Собственник является
                        Страхователем</strong></Col>
                </Row>

                <Row gutterWidth={60} className={'mt-30'}>
                    <Col xs={12} className={'mb-25'}><Title>Агентсткое вознограждение и РПМ</Title></Col>
                    <Col xs={8}>
                        <Row>
                            <Col xs={12} className={'mb-25'}>
                                <Field
                                    disabled
                                    defaultValue={get(data, 'data.result.agentId')}
                                    options={[{label: t('No agent'), value: undefined}, ...agentsList]}
                                    label={'Агент'}
                                    type={'select'}
                                    name={'agentId'}/>
                            </Col>

                            <Col xs={6} className={'mb-25'}>
                                <Field
                                    params={{required: true}}
                                    property={{type: 'number', disabled: true}}
                                    defaultValue={get(data, 'data.result.agentReward', 20)}
                                    label={'Вознограждение %'}
                                    type={'input'}
                                    name={'agentReward'}/>
                            </Col>
                            <Col xs={6} className={'mb-25'}>
                                <Field
                                    params={{required: true}}
                                    defaultValue={get(data, 'data.result.rpm', 5)}
                                    property={{disabled: true}}
                                    label={'Отчисления в РПМ  %'}
                                    type={'input'}
                                    name={'rpmPercent'}/>
                            </Col>
                            <Col xs={6} className={'mb-25'}>
                                <Field
                                    defaultValue={get(data, 'data.result.comission', 0)}
                                    property={{disabled: true}}
                                    label={'Сумма'}
                                    type={'number-format-input'}
                                    name={'rewardSum'}/>
                            </Col>
                            <Col xs={6} className={'mb-25'}>
                                <Field
                                    defaultValue={round(get(data, 'data.result.rpm', 5) * get(data, 'data.result.premium', 0) / 100, 2)}
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