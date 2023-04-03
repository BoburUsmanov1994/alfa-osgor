import React, {useEffect, useMemo} from 'react';
import {useSettingsStore, useStore} from "../../../../store";
import {get} from "lodash";
import GridView from "../../../../containers/grid-view/grid-view";
import {KEYS} from "../../../../constants/key";
import {URLS} from "../../../../constants/url";
import Field from "../../../../containers/form/field";
import {useTranslation} from "react-i18next";

const ProductsContainer = ({...rest}) => {
    const {t} = useTranslation()
    const resetProduct = useSettingsStore(state => get(state, 'resetProduct', () => {
    }))
    const resetRiskList = useSettingsStore(state => get(state, 'resetRiskList', []))
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: 'Продукты',
            path: '/products',
        },
        {
            id: 2,
            title: 'Все продукты',
            path: '/products/all',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
        resetProduct()
        resetRiskList()
    }, [])

    const ModalBody = ({data, rowId = null}) => <>
        <Field name={'name'} type={'input'} label={'Название продукта'} defaultValue={rowId ? get(data, 'name') : null}
               params={{required: true}}/>
    </>
    return (
        <>
            <GridView
                ModalBody={ModalBody}
                tableHeaderData={[
                    {
                        id: 2,
                        key: 'productname',
                        title: 'Наименование продукта'
                    },
                    {
                        id: 3,
                        key: 'typeofpolice',
                        title: 'Тип страховщика',
                        isArray:true
                    },
                    {
                        id: 4,
                        key: 'typeofpayment',
                        title: 'Тип оплаты',
                        isArray:true
                    },
                    {
                        id: 5,
                        key: 'typeofinsurerId.name',
                        title: 'Страхователь',
                    },
                    {
                        id: 6,
                        key: 'policyformatId.name',
                        title: 'Формат полиса',
                    },
                    {
                        id: 7,
                        key: 'fixedpremium',
                        title: 'Страховая сумма',
                        hasNumberFormat:true
                    },
                ]}
                keyId={KEYS.products}
                url={URLS.products}
                title={t('Все продукты')}
                responseDataKey={'data'}
                viewUrl={'/products/view'}
                createUrl={'/products/create'}
                updateUrl={'/products/update'}
                isHideColumn

            />
        </>
    );
};

export default ProductsContainer;