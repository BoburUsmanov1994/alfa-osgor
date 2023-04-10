import React, {useEffect, useMemo, useState} from 'react';
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
import {useGetAllQuery, usePostQuery} from "../../../../hooks/api";
import {KEYS} from "../../../../constants/key";
import {URLS} from "../../../../constants/url";
import {getSelectOptionsListFromData} from "../../../../utils";
import {OverlayLoader} from "../../../../components/loader";
import qrcodeImg from "../../../../assets/images/qrcode.png"
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";
import {useStore} from "../../../../store";

const getEndDateByInsuranceTerm = (term, startDate) => {
    if (!isNil(term)) {
        return dayjs(startDate).add(get(term, 'value'), get(term, 'prefix')).toDate()
    }
    return dayjs()
}

const ViewContainer = ({form_id = null}) => {

    const navigate = useNavigate();
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [{
        id: 1, title: 'OSGOR list', path: '/osgor/list',
    }, {
        id: 2, title: 'OSGOR view', path: '/osgor/list',
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


    const {
        mutate: sendFond, isLoading: isLoadingFond
    } = usePostQuery({listKeyId: KEYS.osgorView})

    const send = () => {
        sendFond({
                url: URLS.osgorSendFond, attributes: {
                    osgor_formId: form_id
                }
            },
            {
                onSuccess: ({data}) => {

                }
            }
        )
    }


    if (isLoading) {
        return <OverlayLoader/>
    }


    return (<>
        {(isLoadingFond) && <OverlayLoader/>}
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
                    <Form
                        footer={<Flex className={'mt-32'}>{isEqual(get(data, 'data.result.status'), 'new') && <><Button
                            danger type={'button'}
                            className={'mr-16'}>Удалить</Button>
                            <Button yellow type={'button'}
                                    className={'mr-16'}>Изменить</Button></>}
                            <Button onClick={send} type={'button'} className={'mr-16'}>Отправить в
                                Фонд</Button>
                            <Button
                                type={'button'} gray className={'mr-16'}>Подтвердить
                                оплату</Button></Flex>}>
                        <Row gutterWidth={60} className={'mt-32'}>
                            <Col xs={4} style={{borderRight: '1px solid #DFDFDF'}}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Статус</Col>
                                    <Col xs={7}><Button green>{get(data, 'data.result.status')}</Button></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Филиал </Col>
                                    <Col xs={7}><Field disabled params={{required: true}} options={[]}
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
                                                       params={{required: true, disabled: true}}
                                                       property={{hideLabel: true}}
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
                                    <Col xs={7}><Field defaultValue={get(data, 'data.result.policies[0].insuranceSum')}
                                                       property={{hideLabel: true, disabled: true}}
                                                       type={'number-format-input'}
                                                       name={'policies[0].insuranceSum'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Страховая премия: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.result.policies[0].insurancePremium')}
                                        property={{hideLabel: true, disabled: true}}
                                        type={'number-format-input'}
                                        name={'policies[0].insurancePremium'}/></Col>
                                </Row>


                            </Col>
                            <Col xs={4}>

                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Срок страхования:</Col>
                                    <Col xs={7}><Field disabled
                                                       defaultValue={get(data, 'data.result.policies[0].insuranceTermId')}
                                                       options={[]} params={{required: true}}
                                                       label={'Insurance term'} property={{hideLabel: true}}
                                                       type={'select'}
                                                       name={'policies[0].insuranceTermId'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Дата начала покрытия: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.result.policies[0].startDate')} disabled
                                        property={{
                                            hideLabel: true,
                                            dateFormat: 'yyyy-MM-dd'
                                        }}
                                        type={'datepicker'}
                                        name={'policies[0].startDate'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Дача окончания покрытия: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.result.policies[0].endDate')} disabled
                                        property={{hideLabel: true, dateFormat: 'yyyy-MM-dd'}} type={'datepicker'}
                                        name={'policies[0].endDate'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Дата выдачи полиса: </Col>
                                    <Col xs={7}><Field defaultValue={get(data, 'data.result.policies[0].issueDate')}
                                                       disabled property={{hideLabel: true, dateFormat: 'yyyy-MM-dd'}}
                                                       type={'datepicker'}
                                                       name={'policies[0].issueDate'}/></Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row gutterWidth={60} className={'mt-15'}>
                            <Col xs={12} className={'mb-15'}><Title>Страхователь</Title></Col>
                            <Col xs={12}>
                                <Row>
                                    <Col xs={12}>
                                        <Flex>
                                            <h4 className={'mr-16'}>Страхователь</h4>
                                            <Button
                                                gray={!get(data, 'data.result.insurant')} className={'mr-16'}
                                                type={'button'}>Физ. лицо</Button>
                                            <Button
                                                gray={!get(data, 'data.result.organization')} type={'button'}>Юр.
                                                лицо</Button>
                                        </Flex>
                                    </Col>

                                </Row>
                            </Col>
                            <Col xs={12}>
                                <hr className={'mt-15 mb-15'}/>
                            </Col>
                            {get(data, 'data.result.insurant') && <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field property={{disabled: true}}
                                           defaultValue={get(data, 'data.result.insurant.person.fullName.firstname')}
                                           label={'Firstname'}
                                           type={'input'}
                                           name={'insurant.person.fullName.firstname'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field property={{disabled: true}}
                                           defaultValue={get(data, 'data.result.insurant.person.fullName.lastname')}
                                           label={'Lastname'} type={'input'}
                                           name={'insurant.person.fullName.lastname'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field property={{disabled: true}}
                                           defaultValue={get(data, 'data.result.insurant.person.fullName.middlename')}
                                           label={'Middlename'}
                                           type={'input'}
                                           name={'insurant.person.fullName.middlename'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field property={{disabled: true}}
                                           defaultValue={get(data, 'data.result.insurant.person.passportData.pinfl')}
                                           label={'ПИНФЛ'} type={'input'}
                                           name={'insurant.person.passportData.pinfl'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field disabled property={{
                                        mask: 'aa',
                                        placeholder: 'AA',
                                        maskChar: '_'
                                    }} defaultValue={get(data, 'data.result.insurant.person.passportData.seria')}
                                           label={'Passport seria'} type={'input-mask'}
                                           name={'insurant.person.passportData.seria'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field disabled property={{
                                        mask: '9999999',
                                        placeholder: '1234567',
                                        maskChar: '_',
                                    }} defaultValue={get(data, 'data.result.insurant.person.passportData.number')}
                                           label={'Passport number'} type={'input-mask'}
                                           name={'insurant.person.passportData.number'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        defaultValue={get(data, 'data.result.insurant.person.birthDate')}
                                        label={'Birth date'}
                                        type={'datepicker'}
                                        name={'insurant.person.birthDate'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        defaultValue={get(data, 'data.result.insurant.person.gender')}
                                        options={[]}
                                        label={'Gender'}
                                        type={'select'}
                                        name={'insurant.person.gender'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        options={[]}
                                        defaultValue={get(data, 'data.result.insurant.person.countryId')}
                                        label={'Country'}
                                        type={'select'}
                                        name={'insurant.person.countryId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        options={[]}
                                        defaultValue={get(data, 'data.result.insurant.person.regionId')}
                                        label={'Region'}
                                        type={'select'}
                                        name={'insurant.person.regionId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        options={[]}
                                        defaultValue={get(data, 'data.result.insurant.person.districtId')}
                                        label={'District'}
                                        type={'select'}
                                        name={'insurant.person.districtId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        options={[]}
                                        defaultValue={get(data, 'data.result.insurant.person.residentType')}
                                        label={'Resident type'}
                                        type={'select'}
                                        name={'insurant.person.residentType'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        property={{disabled: true}}
                                        defaultValue={get(data, 'data.result.insurant.person.address')}
                                        label={'Address'}
                                        type={'input'}
                                        name={'insurant.person.address'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        property={{disabled: true}}
                                        defaultValue={get(data, 'data.result.insurant.person.phone')}
                                        label={'Phone'}
                                        type={'input'}
                                        name={'insurant.person.phone'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        property={{disabled: true}}
                                        defaultValue={get(data, 'data.result.insurant.person.email')}
                                        label={'Email'}
                                        type={'input'}
                                        name={'insurant.person.email'}/>
                                </Col>

                            </>}
                            {/*{isEqual(insurant, 'organization') && <>*/}
                            {/*    <Col xs={3} className={'mb-25'}>*/}
                            {/*        <Field props={{required: true}} label={'INN'} defaultValue={inn} property={{*/}
                            {/*            mask: '999999999',*/}
                            {/*            placeholder: 'Inn',*/}
                            {/*            maskChar: '_'*/}
                            {/*        }} name={'insurant.organization.inn'} type={'input-mask'}/>*/}

                            {/*    </Col>*/}
                            {/*    <Col xs={3} className={'mb-25'}>*/}
                            {/*        <Field props={{required: true}} defaultValue={get(organization, 'name')}*/}
                            {/*               label={'Наименование'} type={'input'}*/}
                            {/*               name={'insurant.organization.name'}/>*/}
                            {/*    </Col>*/}
                            {/*    <Col xs={3} className={'mb-25'}>*/}
                            {/*        <Field label={'Руководитель'} type={'input'}*/}
                            {/*               name={'insurant.organization.representativeName'}/>*/}
                            {/*    </Col>*/}
                            {/*    <Col xs={3} className={'mb-25'}>*/}
                            {/*        <Field label={'Должность'} type={'input'}*/}
                            {/*               name={'insurant.organization.position'}/>*/}
                            {/*    </Col>*/}
                            {/*    <Col xs={3} className={'mb-25'}>*/}
                            {/*        <Field defaultValue={get(organization, 'phone')} props={{required: true}}*/}
                            {/*               label={'Телефон'} type={'input'}*/}
                            {/*               name={'insurant.organization.phone'}/>*/}
                            {/*    </Col>*/}
                            {/*    <Col xs={3} className={'mb-25'}>*/}
                            {/*        <Field defaultValue={get(organization, 'email')} label={'Email'} type={'input'}*/}
                            {/*               name={'insurant.organization.email'}/>*/}
                            {/*    </Col>*/}
                            {/*    <Col xs={3} className={'mb-25'}>*/}
                            {/*        <Field*/}
                            {/*            options={okedList}*/}
                            {/*            defaultValue={get(organization, 'oked')}*/}
                            {/*            label={'ОКЭД'}*/}
                            {/*            type={'select'}*/}
                            {/*            name={'insurant.organization.oked'}/>*/}
                            {/*    </Col>*/}
                            {/*    <Col xs={3} className={'mb-25'}>*/}
                            {/*        <Field label={'Расчетный счет'} type={'input'}*/}
                            {/*               name={'insurant.organization.checkingAccount'}/>*/}
                            {/*    </Col>*/}
                            {/*    <Col xs={3}><Field label={'Область'} params={{required: true}} options={regionList}*/}
                            {/*                       type={'select'}*/}
                            {/*                       name={'insurant.organization.regionId'}/></Col>*/}
                            {/*    <Col xs={3}><Field label={'Форма собственности'} params={{required: true}}*/}
                            {/*                       options={ownershipFormList}*/}
                            {/*                       type={'select'}*/}
                            {/*                       name={'insurant.organization.ownershipFormId'}/></Col>*/}
                            {/*</>}*/}
                        </Row>
                        <Row gutterWidth={60} className={'mt-15'}>
                            <Col xs={12} className={'mb-15'}><Title>Вид деятельности</Title></Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    defaultValue={get(data, 'data.result.policies[0].insuranceRate', 0)}
                                    property={{disabled: true}}
                                    label={'Коэффициент страхового тарифа'}
                                    type={'input'}
                                    name={'comission'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    property={{disabled: true}}
                                    defaultValue={get(data, 'data.result.policies[0].funeralExpensesSum', 0)}
                                    label={'Расходы на погребение'}
                                    type={'input'}
                                    name={'funeralExpensesSum'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    property={{disabled: true}}
                                    defaultValue={get(data, 'data.result.policies[0].fot', 0)}
                                    label={'Фонд оплаты труда'}
                                    type={'number-format-input'}
                                    name={'fot'}/>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Section>
    </>);
};

export default ViewContainer;