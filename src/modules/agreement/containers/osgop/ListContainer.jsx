import React, {useEffect, useMemo} from 'react';
import {useSettingsStore, useStore} from "../../../../store";
import {get} from "lodash";
import GridView from "../../../../containers/grid-view/grid-view";
import {KEYS} from "../../../../constants/key";
import {URLS} from "../../../../constants/url";
import Field from "../../../../containers/form/field";
import {useTranslation} from "react-i18next";
import NumberFormat from "react-number-format";

const ListContainer = ({...rest}) => {
    const {t} = useTranslation()

    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: 'Продукты',
            path: '/osgop',
        },
        {
            id: 2,
            title: 'Все продукты',
            path: '/osgop',
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
                        id: 3,
                        key: 'policies[0].seria',
                        title: 'Policy seria',
                    },
                    {
                        id: 4,
                        key: 'policies[0].number',
                        title: 'Policy number',
                    },
                    {
                        id: 5,
                        key: 'owner',
                        title: 'Owner',
                        render: ({row}) => get(row, 'owner.person') ? `${get(row, 'owner.person.fullName.lastname')} ${get(row, 'owner.person.fullName.firstname')}  ${get(row, 'owner.person.fullName.middlename')}` : get(row, 'owner.organization.name')
                    },
                    {
                        id: 55,
                        key: 'applicant',
                        title: 'Applicant',
                        render: ({row}) => get(row, 'applicant.person') ? `${get(row, 'applicant.person.fullName.lastname')} ${get(row, 'applicant.person.fullName.firstname')}  ${get(row, 'applicant.person.fullName.middlename')}` : get(row, 'applicant.organization.name')
                    },
                    {
                        id: 44,
                        key: 'vehicle',
                        title: 'Vehicle',
                        render: ({row}) => get(row, 'vehicle.modelCustomName')
                    },
                    {
                        id: 6,
                        key: 'cost.insurancePremium',
                        title: 'Insurance premium',
                        render: ({value}) => <NumberFormat displayType={'text'} thousandSeparator={' '} value={value}/>
                    },
                    {
                        id: 7,
                        key: 'cost.sumInsured',
                        title: 'Insurance sum',
                        render: ({value}) => <NumberFormat displayType={'text'} thousandSeparator={' '} value={value}/>
                    },
                    {
                        id: 8,
                        key: 'cost.insurancePremium',
                        title: 'Оплачено',
                        render: ({value, row}) => get(row, 'status') == 'payed' ?
                            <NumberFormat displayType={'text'} thousandSeparator={' '} value={value}/> : 0
                    },
                    {
                        id: 9,
                        key: 'status',
                        title: 'Status',
                    },

                ]}
                keyId={KEYS.osgopList}
                url={URLS.osgopList}
                title={t('Osgop agreements list')}
                responseDataKey={'result.docs'}
                viewUrl={'/osgop/view'}
                createUrl={'/osgop/create'}
                updateUrl={'/osgop/update'}
                isHideColumn
                dataKey={'application_number'}
                deleteUrl={URLS.osgopDelete}

            />
        </>
    );
};

export default ListContainer;