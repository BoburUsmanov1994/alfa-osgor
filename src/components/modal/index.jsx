import React from 'react';
import styled from "styled-components";
import Rodal from 'rodal';

const Styled = styled.div`
  z-index: 9999999;
  position: relative;

  .rodal-dialog {
    width: unset !important;
    max-width: 50%;
    min-width: 750px;
    min-height: 350px !important;
    max-height: 50vh !important;
    overflow-y: auto;
  }

  h2 {
    font-size: 20px;
    font-weight: 600;
    padding-bottom: 15px;
    border-bottom: 1px solid #CBCBCB;
    color: #000;
  }
`;
const Modal = ({
                   children,
                   title = '',
                   visible = false,
                   hide = () => {
                   },
                   ...rest
               }) => {
    return (
        <Styled {...rest}>
            <Rodal visible={visible} onClose={() => hide(false)}>
                <h2>{title}</h2>
                {
                    children
                }
            </Rodal>
        </Styled>
    );
};

export default Modal;