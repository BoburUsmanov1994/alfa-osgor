import React from 'react';
import styled from "styled-components";

const Styled = styled.div`
  padding: 30px;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  border: 1px solid #CDCDCD;
`;

const Card = ({
                  data = {},
                  ...rest
              }) => {
    return (
        <Styled {...rest}>

        </Styled>
    );
};

export default Card;