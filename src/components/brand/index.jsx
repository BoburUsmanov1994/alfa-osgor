import React from 'react';
import styled from "styled-components";
import {NavLink} from "react-router-dom";
import logo from "../../assets/images/logo.svg";

const Styled = styled.div`
  max-width: 100%;
  height: auto;
`;

const Brand = ({url = '/', ...rest}) => {
    return (
        <Styled {...rest}>
            <NavLink to={url}>
                <img src={logo} alt="logo"/>
            </NavLink>
        </Styled>
    );
};

export default Brand;