import React from 'react';
import useAuth from "../../hooks/auth/useAuth";

const IsGuest = ({children}) => {
    const {token} = useAuth({});

    return !token ? children : null
};

export default IsGuest;