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
    return (
        <>
            <GridView
                ModalBody={ModalBody}
                tableHeaderData={[
                    {
                        id: 2,
                        key: 'seria',
                        title: 'Seria'
                    },
                    {
                        id: 3,
                        key: 'number',
                        title: 'Number',
                    },
                    {
                        id: 4,
                        key: 'sum',
                        title: 'Sum',
                    },
                    {
                        id: 5,
                        key: 'contractStartDate',
                        title: 'Contract start date',
                    },
                    {
                        id: 6,
                        key: 'contractEndDate',
                        title: 'Contract end date',
                    },

                ]}
                keyId={KEYS.osgorList}
                url={URLS.osgorList}
                title={t('Osgor agreements list')}
                responseDataKey={'result'}
                viewUrl={'/osgor/view'}
                createUrl={'/osgor/create'}
                updateUrl={'/osgor/update'}
                isHideColumn
                dataKey={'osgor_formId'}

            />
        </>
    );
};

export default ListContainer;