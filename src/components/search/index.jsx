import React from 'react';
import styled from "styled-components";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";

const Styled = styled.form`
  display: flex;

  .search-form-input {
    padding: 15px 25px;
    border: 1px solid #CDCDCD;
    border-radius: 5px 0px 0px 5px;
    display: block;
    width: 100%;
    outline: none;
    transition: 0.2s ease;
    font-size: 16px;
    font-family: 'Gilroy-Regular', sans-serif;

    &:focus {
      border-color: #13D6D1;
    }
  }

  .search-form-btn {
    padding: 15px 20px;
    min-width: 175px;
    text-align: center;
    border: none;
    background: #13D6D1;
    border-radius: 0px 5px 5px 0px;
    color: #fff;
    font-size: 16px;
    font-family: 'Gilroy-Medium', sans-serif;
    cursor: pointer;
  }
`;
const Search = ({
                    ...rest
                }) => {
    const {register, handleSubmit} = useForm();
    const {t} = useTranslation()
    const onSubmit = (data) => {
        console.log('search', data)
    }
    return (
        <Styled onSubmit={handleSubmit(onSubmit)} {...rest}>
            <input placeholder={t('Поиск')}  {...register("search")} type="text" className={'search-form-input'}/>
            <button className={'search-form-btn'} type={'submit'}>{t("Найти")}</button>
        </Styled>
    );
};

export default Search;