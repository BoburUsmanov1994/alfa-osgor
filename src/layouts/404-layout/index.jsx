import React from 'react';
import {Outlet} from "react-router-dom";
const NotFoundLayout = ({...rest}) => {
    return (
        <div>
            404
            <Outlet />
        </div>
    );
};

export default NotFoundLayout;