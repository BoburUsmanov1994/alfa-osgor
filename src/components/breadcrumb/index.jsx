import React from 'react';
import styled from "styled-components";
import {useStore} from "../../store";
import {get, isEqual} from "lodash"
import {NavLink} from "react-router-dom";
import {ChevronRight} from "react-feather";
import classNames from "classnames";
import {useTranslation} from "react-i18next";

const Styled = styled.ul`
  display: flex;
  align-items: center;
  margin-left: 65px;

  li {
    display: flex;
    align-items: center;
    .breadcrumb-link{
      color: #000;
      font-size: 16px;
      transition: 0.2s ease;
      &:hover{
        color: #13D6D1;
      }
      
      &.last{
        font-family: 'Gilroy-Medium', sans-serif;
      }
    }
    svg{
      margin-left: 12px;
      margin-right: 12px;
    }
  }
`;
const Breadcrumb = ({
                        ...rest
                    }) => {
    const {t} = useTranslation()
    const items = useStore(state => get(state, 'breadcrumbs', []))
    return (
        <Styled {...rest}>
            {items && items.map((item, i) => <li key={get(item, 'id', i)}><NavLink
                className={classNames('breadcrumb-link',{last:isEqual(items.length,i+1)})}
                to={get(item, 'path', '#')}>{get(item, 'title')}</NavLink>
                {!isEqual(items.length,i+1) && <ChevronRight size={20} />}
            </li>)}

        </Styled>
    );
};

export default Breadcrumb;