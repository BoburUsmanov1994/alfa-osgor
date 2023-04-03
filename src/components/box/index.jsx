import React from 'react';
import styled from "styled-components";

const Styled = styled.div`
  padding: 40px;
  background: #FFFFFF;
  border: ${({outlined}) => outlined && '1px solid #CDCDCD'};
  box-shadow: 0px 5px 49px rgba(0, 0, 0, 0.06);
  border-radius: 5px;
`;

const Box = ({children, ...rest}) => {
    return (
        <Styled {...rest}>
            {children}
        </Styled>
    );
};

export default Box;