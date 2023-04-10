import React, {useEffect, useMemo} from 'react';
import {useSettingsStore, useStore} from "../../../../store";
import {get} from "lodash";
import GridView from "../../../../containers/grid-view/grid-view";
import {KEYS} from "../../../../constants/key";
import {URLS} from "../../../../constants/url";
import Field from "../../../../containers/form/field";
import {useTranslation} from "react-i18next";

const ListContainer = ({...rest}) => {
    const {t} = useTranslation()

    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: 'Продукты',
            path: '/osgor',
        },
        {
            id: 2,
            title: 'Все продукты',
            path: '/osgor/list',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const ModalBody = ({data, rowId = null}) => <>
        <Field name={'name'} type={'input'} label={'Название продукта'} defaultValue={rowId ? get(data, 'name') : null}
               params={{required: true}}/>
    </>
    // nomer dogovor, nomer police, klient, insurance premium,insurance sum, oplachena,status,
    return (
        <>
            <GridView
                ModalBody={ModalBody}
                tableHeaderData={[
                    {
                        id: 1,
                        key: 'seria',
                        title: 'Agreement seria'
                    },
                    {
                        id: 2,
                        key: 'number',
                        title: 'Agreement number',
                    },
                    {
                        id: 3,
                        key: 'policySeria',
                        title: 'Policy seria',
                    },
                    {
                        id: 4,
                        key: 'policyNumber',
                        title: 'Policy number',
                    },
                    {
                        id: 5,
                        key: 'insurant.person.fullName.firstname',
                        title: 'Client',
                    },
                    {
                        id: 6,
                        key: 'policies[0].insurancePremium',
                        title: 'Insurance premium',
                        hasNumberFormat: true
                    },
                    {
                        id: 7,
                        key: 'policies[0].insuranceSum',
                        title: 'Insurance sum',
                        hasNumberFormat: true
                    },
                    {
                        id: 8,
                        key: 'policies[0].payed',
                        title: 'Оплачено',
                        hasNumberFormat: true
                    },
                    {
                        id: 9,
                        key: 'status',
                        title: 'Status',
                    },

                ]}
                keyId={KEYS.osgorList}
                url={URLS.osgorList}
                title={t('Osgor agreements list')}
                responseDataKey={'result.docs'}
                viewUrl={'/osgor/view'}
                createUrl={'/osgor/create'}
                updateUrl={'/osgor/update'}
                isHideColumn
                dataKey={'osgor_formId'}
                deleteUrl={URLS.osgorDelete}

            />
        </>
    );
};

export default ListContainer;