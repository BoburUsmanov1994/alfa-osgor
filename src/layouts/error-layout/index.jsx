import React from 'react';
import {Outlet} from "react-router-dom";

const ErrorLayout = ({...rest}) => {
    return (
        <div>
           error layout
            <Outlet />
        </div>
    );
};

export default ErrorLayout;