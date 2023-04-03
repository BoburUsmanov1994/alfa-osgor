import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../../store";
import {get} from "lodash";
import {Col, Row} from "react-grid-system";
import Panel from "../../../../components/panel";
import Search from "../../../../components/search";
import Title from "../../../../components/ui/title";
import Section from "../../../../components/section";
import {useDeleteQuery, useGetOneQuery} from "../../../../hooks/api";
import {KEYS} from "../../../../constants/key";
import {URLS} from "../../../../constants/url";
import {ContentLoader, OverlayLoader} from "../../../../components/loader";
import Table from "../../../../components/table";
import {Download, Edit, Trash2} from "react-feather";
import Flex from "../../../../components/flex";
import {useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";


const AgreementViewContainer = ({id, ...rest}) => {
    const {t} = useTranslation();

    const navigate = useNavigate();

    let {data,isLoading,isError} = useGetOneQuery({id,key: KEYS.products, url: URLS.products})

    const {mutate: deleteRequest, isLoading: deleteLoading} = useDeleteQuery({listKeyId: KEYS.products})

    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: t('Продукты'),
            path: '/products',
        },
        {
            id: 2,
            title:  get(data,'data.data.productname'),
            path: '#',
        }
    ], [data])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [get(data,'data.data')])

    const remove = (val) => {
        Swal.fire({
            position: 'center',
            icon: 'error',
            backdrop: 'rgba(0,0,0,0.9)',
            background: 'none',
            title: 'Are you sure?',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#13D6D1',
            confirmButtonText: 'Delete',
            customClass: {
                title: 'title-color',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                deleteRequest({url: `${URLS.products}/${val}`})
                navigate('/products/all')
            }
        });
    }

    const product = get(data,'data.data',{})

    if(isLoading){
        return <OverlayLoader />
    }
    return (
        <>
            {deleteLoading && <ContentLoader />}
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
                        <Flex className={'w-100'}>
                            <Title>{get(product,'productname',t('Product'))}</Title>
                            <Edit onClick={()=>navigate(`/products/update/${id}`)} className={'cursor-pointer mr-10 ml-15'} size={28} color={'#13D6D1'}/>
                            <Trash2 onClick={() => remove(id)}
                                    className={'cursor-pointer '} size={28} color={'#dc2626'}/>
                        </Flex>
                    </Col>
                </Row>
                <Row>
                    <Col xs={6}>

                        <Table thead={['1', '2']}>
                            <tr>
                                <td>Категория</td>
                                <td><strong>{get(product,'groupofproductsId.name','-')}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Под категория")}</td>
                                <td><strong>{get(product,'subgroupofproductsId.name','-')}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("codeproduct")}</td>
                                <td><strong>{get(product,'codeproduct','-')}</strong></td>
                            </tr>
                            <tr>
                                <td>Работа по версии продукта (Версия продукта)</td>
                                <td><strong>{get(product,'versionproduct','-')}</strong></td>
                            </tr>
                            <tr>
                                <td>Тип страховщика</td>
                                <td><strong>{get(product,'typeofinsurerId.name',"-")}</strong></td>
                            </tr>
                            <tr>
                                <td>Наименование продукта</td>
                                <td><strong>{get(product,'productname','-')}</strong></td>
                            </tr>
                            <tr>
                                <td>Статус договора</td>
                                <td><strong>{get(product,'statusofproducts.name','-')}</strong></td>
                            </tr>
                            <tr>
                                <td>Требует разрешения</td>
                                <td><strong>{get(product,'isrequirepermission',false) ? 'Да' : 'Нет'}</strong></td>
                            </tr>
                            <tr>
                                <td>Тип полиса</td>
                                <td><strong>{get(product,'typeofpolice',[]).map(({name})=>name).join(" , ")}</strong></td>
                            </tr>
                            <tr>
                                <td>Разрешить несколько агентов</td>
                                <td><strong>{get(product,'Isagreement',false) ? 'Да' : 'Нет'}</strong></td>
                            </tr>
                            <tr>
                                <td>Имеет фиксированный превентивных мероприятий</td>
                                <td><strong>{get(product,'Isfixedpreventivemeasures',false) ? 'Да' : 'Нет'}</strong></td>
                            </tr>
                            <tr>
                                <td>Разрешить иностранную валюту</td>
                                <td><strong>{get(product,'Isforeigncurrency',false) ? 'Да' : 'Нет'}</strong></td>
                            </tr>
                            <tr>
                                <td>Разрешение изменение франшизы</td>
                                <td><strong>{get(product,'Isfranchisechange',false) ? 'Да' : 'Нет'}</strong></td>
                            </tr>
                        </Table>
                    </Col>
                    <Col xs={6}>
                        <Table thead={['1', '2']}>
                            <tr>
                                <td>Форма анкеты</td>

                                <td><a href={get(product,'applicationformId','#')} target={'_blank'} download><Download color={'#13D6D1'} /></a></td>
                            </tr>
                            <tr>
                                <td>Договор</td>
                                <td><a href={get(product,'contractform','#')} target={'_blank'} download><Download color={'#13D6D1'} /></a></td>
                            </tr>
                            <tr>
                                <td>Приложения</td>
                                <td><a href={get(product,'additionaldocuments','#')} target={'_blank'} download><Download color={'#13D6D1'} /></a></td>
                            </tr>
                            <tr>
                                <td>Формат полиса</td>
                                <td><strong>{get(product,'policyformatId.name','-')}</strong></td>
                            </tr>
                            <tr>
                                <td>Имеет фиксированного страхователя</td>
                                <td><strong>{get(product,'Isfixedpolicyholder',false) ? 'Да' : 'Нет'}</strong></td>
                            </tr>
                            <tr>
                                <td>Имеет выгодоприобретеля</td>
                                <td><strong>{get(product,'Isbeneficiary',false) ? 'Да' : 'Нет'}</strong></td>
                            </tr>
                            <tr>
                                <td>Имеет фиксированного выгодоприобретеля</td>
                                <td><strong>{get(product,'Isfixedbeneficiary',false) ? 'Да' : 'Нет'}</strong></td>
                            </tr>
                            <tr>
                                <td>Имеет фиксированную страховую сумму</td>
                                <td><strong>{get(product,'Isfixedfee',false) ? 'Да' : 'Нет'}</strong></td>
                            </tr>
                            <tr>
                                <td>Разрешить полис без оплаты</td>
                                <td><strong>{get(product,'Ispolicywithoutpayment',false) ? 'Да' : 'Нет'}</strong></td>
                            </tr>
                            <tr>
                                <td>Тип оплаты</td>
                                <td><strong>{get(product,'typeofpayment',[]).map(({name})=>name).join(" , ")}</strong></td>
                            </tr>
                            <tr>
                                <td>Имеет фиксированную комиссию</td>
                                <td><strong>{get(product,'Isfixedfee',false) ? 'Да' : 'Нет'}</strong></td>
                            </tr>
                            <tr>
                                <td>Имеет диапазон ставок</td>
                                <td><strong>{get(product,'Isbettingrange',false) ? 'Да' : 'Нет'}</strong></td>
                            </tr>
                            <tr>
                                <td>Имеет франшизу</td>
                                <td><strong>{get(product,'Isfranchisechange',false) ? 'Да' : 'Нет'}</strong></td>
                            </tr>
                        </Table>
                    </Col>
                </Row>
            </Section>
        </>
    );
};

export default AgreementViewContainer;