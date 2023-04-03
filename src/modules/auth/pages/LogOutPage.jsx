import React, {useEffect} from 'react';
import storage from "../../../services/storage";
import {Navigate} from "react-router-dom";
import {useSettingsStore} from "../../../store";
import {get} from "lodash";
import {useTranslation} from "react-i18next";

const LogOutPage = ({
                        ...rest
                    }) => {

    const {t} = useTranslation()
    const setUser = useSettingsStore(state => get(state, 'setUser', () => {
    }))
    const setAuth = useSettingsStore(state => get(state, 'setUser', () => {
    }))
    const clearToken = useSettingsStore(state => get(state, 'setToken', () => {
    }))
    const clearKey = useSettingsStore(state => get(state, 'setKey', () => {
    }))
    const logout = () => {
        setUser(null);
        setAuth(false);
        clearToken(null);
        clearKey(null);
        storage.remove('settings');
        window.location.reload()
    }
    useEffect(() => {
        logout();
    })

    return <Navigate to={'/'}/>;
};

export default LogOutPage;