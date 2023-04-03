import React, {useState} from 'react';
import styled from "styled-components";
import {Container, Row, Col} from "react-grid-system";
import Brand from "../brand";
import Flex from "../flex";
import Breadcrumb from "../breadcrumb";
import Dropdown from "../dropdown";
import Profile from "../profile";
import {Settings, ExternalLink} from "react-feather";
import Swal from "sweetalert2";
import {useSettingsStore} from "../../store";
import {useNavigate} from "react-router-dom";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import Language from "../lang";

const Styled = styled.header`
  padding: 20px;
  border-bottom: 1px solid #A8A8A8;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  z-index: 999;
  background-color: #fff;
  //overflow: hidden;
  .profile-body {
    width: 200px;
    top: 300px;
    text-align: left;
    padding-top: 15px;
    padding-bottom: 15px;

    li {
      padding: 5px 15px;
      cursor: pointer;
      transition: 0.3s ease;
      margin-bottom: 6px;
      align-items: center;
      display: flex;

      &:last-child {
        margin-bottom: 0;
      }

      span {
        margin-left: 10px;
        font-size: 15px;
      }

      &:hover {
        color: #13D6D1;
      }
    }
  }

 
`;

const Header = ({...rest}) => {

    const clearToken = useSettingsStore(state => get(state, 'setToken', () => {
    }))

    const navigate = useNavigate();

    const {t} = useTranslation()


    const logout = () => {
        Swal.fire({
            title: t('Чиқишга ишончингиз комилми?'),
            icon: 'warning',
            backdrop: 'rgba(0,0,0,0.9)',
            background: 'none',
            showCancelButton: true,
            confirmButtonColor: '#13D6D1',
            confirmButtonText: t('Ҳа албатта'),
            cancelButtonText: t('Ортга қайтиш'),
            customClass: {
                title: 'title-color',
                content: 'text-color',
                icon: 'icon-color',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/auth/logout');
            }
        });
    }
    return (
        <Styled {...rest}>
            <Container fluid>
                <Row align={'center'}>
                    <Col xs={8}>
                        <Flex justify={'space-between'}>
                            <Flex>
                                <Brand/>
                                <Breadcrumb/>
                            </Flex>
                        </Flex>
                    </Col>
                    <Col xs={4}>
                        <Flex justify={'flex-end'}>
                            <Language/>
                            <Dropdown button={<Profile username={'Admin'}/>}>
                                <ul className={'profile-body'}>
                                    <li><Settings size={20}/><span>{t("Settings")}</span></li>
                                    <li onClick={logout}><ExternalLink size={20}/><span>{t("Logout")}</span></li>
                                </ul>
                            </Dropdown>
                        </Flex>
                    </Col>
                </Row>
            </Container>
        </Styled>
    );
};

export default Header;