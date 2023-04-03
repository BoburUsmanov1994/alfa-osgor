import React from 'react';
import {Outlet} from "react-router-dom";
import styled from "styled-components";
import {Container,Row,Col} from "react-grid-system";
import Header from "./components/header";
import Box from "../../components/box";

const Styled = styled.div`
    .box{
    margin-top: 15vh;
    }
`;

const AuthLayout = ({...rest}) => {
    return (
        <Styled {...rest}>
            <Header/>
            <div className="box">
                <Container>
                    <Row justify={'center'}>
                        <Col xs={4}>
                            <Box>
                                <Outlet/>
                            </Box>
                        </Col>
                    </Row>
                </Container>

            </div>
        </Styled>
    );
};

export default AuthLayout;