import React,{useState,memo} from 'react';
import styled from 'styled-components';
import Rodal from 'rodal';
import Form from "../../form/form";
import Button from "../../../components/ui/button";
import {useGetOneQuery} from "../../../hooks/api";
import {get, isEqual} from "lodash";
import {useTranslation} from "react-i18next";

const Styled = styled.div`
  .rodal-dialog {
    padding: 40px 30px !important;
    height: auto !important;
    overflow-y: auto;
    left: 50% !important;
    top: 50% !important;
    transform: translate(-50%,-50%);
    right: unset !important;
    bottom: unset !important;
    max-height: 60vh !important;
  }
`;
const GridModal = ({
                       hide = () => {
                       },
                       visible = false,
                       create = () => {
                       },
                       update = () => {
                       },
                       rowId = null,
                       url = null,
                       keyId = null,
                       responseDataKey,
                       ModalBody = null,
                       ...rest
                   }) => {
    const {t} = useTranslation()

    const {data, isLoading} = useGetOneQuery({id: rowId, key: keyId, url, enabled: !!(rowId),showErrorMsg:false})
    return (
        <Styled {...rest}>
            <Rodal visible={visible} onClose={hide}>
                <Form   formRequest={rowId ? update : create} footer={<Button type={'submit'} className={'w-100'} >
                    {
                        rowId ? t('Edit') : t('Send')
                    }
                </Button>}>
                    <ModalBody rowId={rowId} data={get(data,`data.${responseDataKey}`,{})}  />
                </Form>
            </Rodal>
        </Styled>
    );
};

export default memo(GridModal);