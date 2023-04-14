import React from 'react';
import {Outlet} from "react-router-dom";
import Header from "../../components/header";

import styled from "styled-components";
import Sidebar from "../../components/sidebar";
import Content from "../../components/content";
import {useGetAllQuery} from "../../hooks/api";
import {KEYS} from "../../constants/key";
import {URLS} from "../../constants/url";
import {useStore} from "../../store";
import {get} from "lodash";

const Styled = styled.div`
  padding-top: 80px;
  position: relative;

  .wrap-content {
    display: flex;
  }
`;
const MainLayout = ({...rest}) => {
    const setUser = useStore(state => get(state, 'setUser', []))
    const {data, isLoading} = useGetAllQuery({
        key: KEYS.getMe, url: URLS.getMe, cb: {
            success: ({result}) => {
                setUser(result)
            }
        }
    })
    return (
        <Styled {...rest}>
            <Header/>
            <div className={'wrap-content'}>
                <Sidebar/>
                <Content>
                    <Outlet/>
                </Content>
            </div>
        </Styled>
    );
};

export default MainLayout;