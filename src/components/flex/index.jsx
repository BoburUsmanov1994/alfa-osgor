import React from 'react';
import styled, {css} from "styled-components";

const Styled = styled.div`
  display: flex;
  align-items: ${({align}) => align || 'center'};;
  justify-content: ${({justify}) => justify || 'flex-start'};
`;
const Flex = ({
                  ...rest
              }) => {
    return (
        <Styled {...rest} />
    );
};

export default Flex;