import React, {useState} from 'react';
import styled from "styled-components";
import {NavLink} from "react-router-dom";
import {get, isEqual} from "lodash";
import {menuData} from "../../constants/menu";
import {ChevronRight, ChevronDown} from 'react-feather';
import classNames from "classnames";
import {useTranslation} from "react-i18next";

const StyledMenu = styled.div`
  //padding-top: 15px;
`;

const StyledMenuLink = styled(NavLink)`
  margin-left: 40px;
  margin-right: 18px;
  padding: 12px 0;
  display: flex;
  border-bottom: 1px solid #CDCDCD;
  justify-content: space-between;
  align-items: center;

  &:hover {
    .menu-title {
      color: #13D6D1;
    }

    .menu-icon > svg {
      stroke: #13D6D1;
    }
  }

  &.active-link, &.active {
    margin-left: 0;
    margin-right: 0;
    padding-left: 24px;
    padding-right: 16px;
    background-color: #13D6D1;

    .menu-title {
      color: #fff;
    }

    .menu-icon > svg {
      stroke: #fff;
    }
  }

  .menu-title {
    font-size: 16px;
    color: #000;
    text-decoration: none;
  }

  .menu-icon {
    svg {
      margin-top: 3px;
    }
  }
`;

const StyledSubMenuLink = styled(NavLink)`
  padding: 12px 30px;
  text-decoration: none;
  font-size: 14px;
  color: #000;
  border-bottom: 1px solid #AAAAAA;
  display: block;
  &:hover{
    background-color: #E9E9E9;
  }
  &.active{
    background-color: #E9E9E9;
  }
`;
const Menu = ({...rest}) => {
    const [active, setActive] = useState(null);
    const {t} = useTranslation();
    const showSubMenu = (id) => {
        setActive(id);
    }
    return (
        <StyledMenu {...rest}>
            {menuData && menuData.map((menu, i) => <><StyledMenuLink
                key={get(menu, 'id', i)}
                onClick={(e) => {
                    if (get(menu, 'submenu')) e.preventDefault();
                    showSubMenu(get(menu, 'id'))
                }
                }
                to={get(menu, 'path', '#')}
                className={classNames({'active-link': isEqual(active, get(menu, 'id'))})}
            >
                <span className={'menu-title'}>{t(get(menu, 'title', '-'))}</span>
                {get(menu, 'submenu') && <span className={'menu-icon'}>
                    {isEqual(active, get(menu, 'id')) ? <ChevronDown size={20} color={'#000'}/> :
                        <ChevronRight size={20} color={'#000'}/>}
                </span>}
            </StyledMenuLink>
                    {
                        isEqual(active, get(menu, 'id')) && get(menu,'submenu') && get(menu,'submenu',[]).map(
                            (submenu,j) => <StyledSubMenuLink to={get(submenu,'path','#')} key={get(submenu,'id',j)}>
                                {t(get(submenu,'title'))}
                            </StyledSubMenuLink>
                        )
                    }
            </>
            )}
        </StyledMenu>
    );
};

export default Menu;