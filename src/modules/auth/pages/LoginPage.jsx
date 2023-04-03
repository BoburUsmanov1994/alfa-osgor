import React from 'react';
import LoginContainer from "../containers/LoginContainer";
import styled from "styled-components";

const Styled = styled.div`
.form-btn{
  display: block;
  width: 100%;
  font-family: 'Gilroy-Bold', sans-serif;
}
`;

const LoginPage = ({...rest}) => {
    return (
        <Styled>
          <LoginContainer {...rest} />
        </Styled>
    );
};

export default LoginPage;