import React from 'react';
import styled, {css} from "styled-components";

const StyledButton = styled.button`
  font-size: 16px;
  padding: 12px 24px;
  background-color: #13D6D1;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  border: unset;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  min-width: 175px;
  font-family: 'Gilroy-Medium', sans-serif;
  ${({lg}) => lg && css`
    padding: 16px 32px;
  `}
  ${({danger}) => danger && css`
    background-color: #ef466f;
  `}
  ${({green}) => green && css`
    background-color: #36BA6B;
  `}
  ${({yellow}) => yellow && css`
    background-color: #FFE5A2;
    color: #000;
  `}
  ${({transparent}) => transparent && css`
    background-color: transparent;
    color: #000;
  `}
  ${({dark}) => dark && css`
    background-color: #1D283A;
  `}
  ${({gray}) => gray && css`
    background-color: #DFDFDF;
    color: #000;
  `}

  ${({inline}) => inline && css`
    min-width: unset;
  `}
  ${({sm}) => sm && css`
    padding: 9px 12px;
  `}

`;

const Button = ({...rest}) => {
    return (
        <StyledButton {...rest} />
    );
};

export default Button;