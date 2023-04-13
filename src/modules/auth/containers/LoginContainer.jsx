import React from 'react';
import {useNavigate} from 'react-router-dom';
import Form from "../../../containers/form/form";
import Field from "../../../containers/form/field";
import Button from "../../../components/ui/button";
import {usePostQuery} from "../../../hooks/api";
import {useSettingsStore} from "../../../store";
import {get} from "lodash";
import Swal from "sweetalert2";
import {OverlayLoader} from "../../../components/loader";
import {URLS} from "../../../constants/url";
import i18next from "i18next";
import {useTranslation} from "react-i18next";

const LoginContainer = ({...rest}) => {
    const {t} = useTranslation()
    const {mutate, isLoading} = usePostQuery({url: URLS.login, hideSuccessToast: true})

    const setToken = useSettingsStore(state => get(state, 'setToken', () => {
    }))
    const setTranslateToken = useSettingsStore(state => get(state, 'setTranslateToken', () => {
    }))
    const navigate = useNavigate();

    const loginRequest = ({data}) => {
        mutate({url: URLS.login, attributes: data}, {
            onSuccess: ({data}) => {
                setToken(get(data, 'result.access_token', null))
                setTranslateToken(get(data, 'result.alfa_token', null))
                navigate("/osgor");
                i18next.reloadResources()
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    backdrop: 'rgba(0,0,0,0.9)',
                    background: 'none',
                    title: t('Добро пожаловать в нашу систему'),
                    showConfirmButton: false,
                    timer: 2000,
                    customClass: {
                        title: 'title-color',
                    },
                });
            }
        })
    }

    if (isLoading) {
        return <OverlayLoader/>
    }

    return (
        <div>
            <Form formRequest={loginRequest}
                  footer={<Button className={'form-btn'} type={'submit'}>{t("Login")}</Button>}>
                <Field name={'username'} type={'input'} label={t('Username')} params={{
                    required: true,
                }}
                       property={{placeholder: t('Username')}}
                />
                <Field name={'password'} type={'input'} label={t('Password')}
                       params={{required: true}} property={{placeholder: t('Password'), type: 'password'}}/>
            </Form>
        </div>
    );
};

export default LoginContainer;