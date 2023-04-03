import React, {useState} from 'react';
import styled from "styled-components";
import Dropdown from "../dropdown";
import {get, isEqual} from "lodash";
import {useTranslation} from "react-i18next";
import config from "../../config";
import {useSettingsStore} from "../../store";
import {langData} from "../../constants/lang";
import {ChevronDown} from "react-feather";


const Styled = styled.div`
  .lang {
    display: flex;
    align-items: center;


    span {
      font-family: 'Gilroy-Bold', sans-serif;
      font-size: 18px;
      margin-right: 5px;
    }

    &-body {
      padding: 10px 15px;
      width: 50px !important;

      li {
        font-family: 'Gilroy-Medium', sans-serif;
        margin-bottom: 5px;
        cursor: pointer;
        transition: 0.3s ease;
        &:hover{
          color: #13D6D1;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
`;

const Language = ({
                      ...rest
                  }) => {

    const [close, setClose] = useState(false);

    const {t, i18n} = useTranslation()

    const setLang = useSettingsStore(state => get(state, 'setLang', () => {
    }))

    const lang = useSettingsStore(state => get(state, 'lang', config.DEFAULT_APP_LANG))

    const changeLang = (code = "ru") => {
        setLang(code);
        setClose(true);
        return i18n.changeLanguage(code)
    }

    return (
        <Styled {...rest}>
            <Dropdown isClose={close} button={<div onClick={() => setClose(false)} className={'lang'}>
                <span>{get(langData.find(item => isEqual(get(item, 'code'), lang)), 'title')}</span><ChevronDown/>
            </div>}>
                {!close && <ul className={'lang-body'}>
                    {
                        langData && langData.map(item => <li
                            key={get(item, 'code')} onClick={() => changeLang(get(item, 'code'))}>{get(item, 'title')}</li>)
                    }

                </ul>}
            </Dropdown>
        </Styled>
    );
};

export default Language;