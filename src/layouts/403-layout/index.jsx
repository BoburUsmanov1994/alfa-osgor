import React from 'react';
import {Outlet} from "react-router-dom";
const ForbiddenLayout = () => {
    return (
        <div>
            403
            <Outlet />
        </div>
    );
};

export default ForbiddenLayout;