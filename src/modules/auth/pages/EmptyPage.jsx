import React from 'react';
import styled from "styled-components";
import emptyImg from "../../../assets/images/empty.png"
const Styled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ErrorPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <img className={'img-fluid'} src={emptyImg}  alt="Empty"/>
        </Styled>
    );
};

export default ErrorPage;