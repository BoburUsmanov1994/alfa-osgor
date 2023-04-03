import React from 'react';
import styled from "styled-components";
import Menu from "../menu";
import alfa from "../../assets/images/alfa.png";

const Styled = styled.aside`
  position: fixed;
  width: 250px;
  height: calc(100vh - 80px);
  border-right: 1px solid #CBCBCB;
  background-color: #fff;
  background-repeat: no-repeat;
  background-position: right bottom;
  background-image: url(${alfa});
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 99;
`;

const Sidebar = ({children,...rest}) => {
    return (
        <Styled {...rest}>
            <Menu />
        </Styled>
    );
};

export default Sidebar;