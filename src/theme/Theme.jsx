import React from 'react';
import {createGlobalStyle, ThemeProvider} from "styled-components";
import Wrapper from "../components/wrapper";
import {ToastContainer} from "react-toastify";
import "nprogress/nprogress.css";
import 'react-toastify/dist/ReactToastify.css';
import 'rodal/lib/rodal.css';
import 'rc-slider/assets/index.css';
import 'react-tabs/style/react-tabs.css';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  h1, h2, h3, h4, h5, h6, p, ul {
    margin: 0;
    padding: 0;
  }
  ul {
    list-style: none;
  }
  a {
    text-decoration: none;
  }
  body {
    color: #707070;
    font-size: 16px;
    line-height: 1.45;
    font-weight: 400;
    //font-family: 'Gilroy-Bold', sans-serif;
    //font-family: 'Gilroy-Heavy', sans-serif;
    //font-family: 'Gilroy-Light', sans-serif;
    //font-family: 'Gilroy-Medium', sans-serif;
    font-family: 'Gilroy-Regular', sans-serif;
  }
  .title-color {
    color: #fff !important;
    font-size: 30px !important;
  }
  .img-fluid{
    max-width: 100%;
    height: auto;
  }
  #nprogress .bar {
    background: #13D6D1 !important;
    height: 4px !important;
    z-index: 99999 !important;
  }
  .text-center {
    text-align: center;
  }
  .text-right {
    text-align: right;
  }
  .text-danger{
    color: #EF142F;
  }
  .cursor-pointer {
    cursor: pointer;
  }
  .rodal, .rodal-mask{
   z-index: 999!important; 
  }
  .rodal-dialog{
    z-index: 1000;
  }
  .w-100{
    width: 100% !important;
  }
  
  .horizontal-scroll{
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
  .mr-16{
    margin-right: 16px !important;
  }

  .mt-32{
    margin-top: 32px !important;
  }
  .mb-15{
    margin-bottom: 15px !important;
  }
  .mt-15{
    margin-top: 15px !important;
  }
  .mb-25{
    margin-bottom: 25px !important;
  }
  .mb-20{
    margin-bottom: 20px !important;
  }
  .ml-50{
    margin-left: 50px !important;
  }
  .ml-15{
    margin-left: 15px !important;
  }
  .mb-0{
    margin-bottom: 0 !important;
    .form-group{
      margin-bottom: 0;
    }
  }
  .text-uppercase{
    text-transform: uppercase !important;
  }
  .rc-checkbox-inner{
    height: 18px;
    width: 18px;
    -webkit-border-radius: 4px;-moz-border-radius: 4px;border-radius: 4px;
  }
  .rc-checkbox-checked .rc-checkbox-inner{
    background-color: #47BA67;
    border-color: #47BA67;
  }
  
  /* width */
  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  /* Track */
  ::-webkit-scrollbar-track {
    background: #F5F5F5;
  }
  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #13D6D1;
    border-radius: 6px;
  }
  *{
    scrollbar-color:#13D6D1 #F5F5F5;
    scrollbar-width:thin;
  }
  .mr-10{
    margin-right: 10px !important;
  }
  .mr-8{
    margin-left: 8px !important;
  }

  .bg-danger {
    background-color: rgba(247, 102, 82, 0.1);
  }
  .bg-success {
    background-color: rgba(33, 213, 155, 0.1);
  }
  .bg-primary{
    background-color: rgba(87, 184, 255, 0.1);
  }
  table {
    border-collapse: collapse;
  }
  .rodal, .rodal-mask {
    z-index: 999 !important;
  }

  .rodal-dialog {
    z-index: 1000;
  }

  @media print{@page {size: landscape}}
  
`;
const Theme = ({children}) => {
    return (
        <ThemeProvider theme={{}}>
            <GlobalStyles/>
            <ToastContainer />
            <Wrapper>
                {children}
            </Wrapper>
        </ThemeProvider>
    );
};

export default Theme;