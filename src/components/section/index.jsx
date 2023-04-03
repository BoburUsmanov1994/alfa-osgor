import React from 'react';
import styled from "styled-components";
import {Container} from "react-grid-system";

const Styled = styled.section`
  padding: 25px 15px;
  background-color: #fff;
  
`;
const Section = ({
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

export default Section;