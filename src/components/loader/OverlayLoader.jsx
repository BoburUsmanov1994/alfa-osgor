import React from 'react';
import {PuffLoader} from "react-spinners";
import styled from "styled-components";

const Styled = styled.div`
position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  height: 100vh;
  width: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255,255,255,0.8);
`;
const OverlayLoader = ({...rest}) => {
    return (
        <Styled {...rest}>
            <PuffLoader size={125} color="#13D6D1"  />
        </Styled>
    );
};

export default OverlayLoader;