import React from 'react';
import styled from "styled-components";
import {Container} from "react-grid-system";

const Styled = styled.div`
  padding: 12px 15px;
  background-color: #F7F7F7;
  width: 100%;
  display: block;
`;

const Panel = ({
                   children,
                   ...rest
               }) => {
    return (
        <Styled {...rest}>
            <Container fluid>
                {children}
            </Container>
        </Styled>
    );
};

export default Panel;