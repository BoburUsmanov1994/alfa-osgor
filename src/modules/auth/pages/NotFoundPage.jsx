import React from 'react';
import styled from "styled-components";
import notFoundImg from "../../../assets/images/404.png"
const Styled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const NotFoundPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <img className={'img-fluid'} src={notFoundImg}  alt="404"/>
        </Styled>
    );
};

export default NotFoundPage;