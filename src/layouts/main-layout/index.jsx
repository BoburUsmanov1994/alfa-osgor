import React from 'react';
import {Outlet} from "react-router-dom";
import Header from "../../components/header";

import styled from "styled-components";
import Sidebar from "../../components/sidebar";
import Content from "../../components/content";

const Styled = styled.div`
  padding-top: 80px;
  position: relative;
  .wrap-content{
    display: flex;
  }
`;
const MainLayout = ({...rest}) => {

    return (
        <Styled {...rest}>
            <Header/>
            <div className={'wrap-content'}>
                <Sidebar />
                <Content>
                    <Outlet/>
                </Content>
            </div>
        </Styled>
    );
};

export default MainLayout;