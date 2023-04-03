import React from 'react';
import styled from "styled-components";
import {BounceLoader} from "react-spinners";

const Styled = styled.div`
position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255,255,255,0.75);
  z-index: 888;
`;
const ContentLoader = ({...rest}) => {
    return (
        <Styled {...rest}>
            <BounceLoader size={80} color="#13D6D1" />
        </Styled>
    );
};

export default ContentLoader;