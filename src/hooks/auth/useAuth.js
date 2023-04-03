import React from 'react';
import {get} from "lodash";
import {useSettingsStore, useStore} from "../../store";

const useAuth = ({...rest}) => {
    const user = useStore(state => get(state, 'user', null))
    const token = useSettingsStore(state => get(state, 'token', null))
    return {
        user,
        token
    }
};

export default useAuth;