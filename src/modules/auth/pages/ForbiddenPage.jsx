import React from 'react';
import styled from "styled-components";
import forbiddenImg from "../../../assets/images/403.png"
const Styled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ForbiddenPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <img className={'img-fluid'} src={forbiddenImg}  alt="403"/>
        </Styled>
    );
};

export default ForbiddenPage;