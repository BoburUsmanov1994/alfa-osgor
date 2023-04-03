import React from 'react';
import styled from "styled-components";
import MaskedInput from "react-input-mask";

const Styled = styled.div`
  display: flex;
  border:2px solid #B7B7B7;
  border-radius: 5px;
  .input {
    padding: 12px 18px;
    color: #000;
    font-size: 16px;
    outline: none;
    font-family: 'Gilroy-Regular', sans-serif;

    &.error {
      border-color: #ef466f;
    }

    &:focus {
      border-color: #13D6D1;
    }
  }
`;
const Index = ({...rest}) => {
    return (
        <Styled {...rest}>
            <MaskedInput mask={'99'} className={'input'} placeholder={'01'}/>
            <MaskedInput mask={'A'} className={'input'}/>
            <MaskedInput mask={'999'} className={'input'}/>
            <MaskedInput mask={'AA'} className={'input'}/>
        </Styled>
    );
};

export default Index;