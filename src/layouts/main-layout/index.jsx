import React from 'react';
import {Outlet} from "react-router-dom";
import Header from "../../components/header";

import styled from "styled-components";
import Sidebar from "../../components/sidebar";
import Content from "../../components/content";
import {useGetAllQuery, useGetAllQueryAlfa} from "../../hooks/api";
import {KEYS} from "../../constants/key";
import {URLS} from "../../constants/url";
import {useStore} from "../../store";
import {get} from "lodash";
import storage from "../../services/storage";

const Styled = styled.div`
  padding-top: 80px;
  position: relative;

  .wrap-content {
    display: flex;
  }
`;
const MainLayout = ({...rest}) => {
    const setUser = useStore(state => get(state, 'setUser', []))
    const token = get(JSON.parse(storage.get('settings')), 'state.translateToken', null) ;
    const {data, isLoading} = useGetAllQueryAlfa({
        key: KEYS.getMeAlfa, url: URLS.getMeAlfa, cb: {
            success: ({users:result}) => {
                setUser(result)
            }
        },
        enabled:!!(token)
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