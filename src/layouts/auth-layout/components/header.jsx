import React from 'react';
import styled from "styled-components";
import {Container, Row, Col} from "react-grid-system";
import {NavLink} from "react-router-dom";
import Brand from "../../../components/brand";
import Flex from "../../../components/flex";
import Language from "../../../components/lang";
import {useTranslation} from "react-i18next";

const Styled = styled.div`
  padding: 20px 25px;
  border-bottom: 1px solid #A8A8A8;

  .nav-link {
    font-size: 16px;
    display: inline-block;
    padding: 10px 30px;
    color: #000;
    background-color: transparent;
    margin-left: 30px;

    &.active {
      background-color: #1D283A;
      color: #fff;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
      font-family: 'Gilroy-Medium', sans-serif;
    }
  }
`;

const Header = ({...rest}) => {
    const {t} = useTranslation()
    return (
        <Styled {...rest}>
            <Container fluid>
                <Row align={'center'}>
                    <Col xs={6}>
                        <Brand/>
                    </Col>
                    <Col className={'text-right'} xs={6}>
                        <Flex justify={'flex-end'}>
                            <Language/>
                            <NavLink className={'nav-link'} to={'/auth'} end>
                                {t("Вход")}
                            </NavLink>
                        </Flex>
                    </Col>
                </Row>
            </Container>
        </Styled>
    );
};

export default Header;