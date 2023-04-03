import React from 'react';
import styled from "styled-components";
import {ChevronRight} from "react-feather";
import classNames from "classnames";
import {includes, isEqual, range} from "lodash";
import {useTranslation} from "react-i18next";

const Styled = styled.ul`
  margin-top: 30px;
  margin-bottom: 30px;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 10px 0;
  align-items: center;
  width: 100%;
  white-space: nowrap;

  .step {
    &-item {
      display: flex;
      align-items: center;
      margin-left: 25px;

      &:first-child {
        margin-left: 12px;
      }

      &.active {
        .step-number {
          background-color: #1D283A;
        }

        .step-text {
          font-family: 'Gilroy-Medium', sans-serif;
        }
      }
    }

    &-number {
      display: flex;
      width: 55px;
      height: 55px;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;
      background-color: #E6E6E6;
      font-size: 24px;
      justify-content: center;
      align-items: center;
      font-family: 'Gilroy-Heavy', sans-serif;
      color: #fff;
      padding: 5px;
      background-clip: content-box;
      border: 1px dashed rgba(29, 40, 58, 0.6);
      margin-right: 25px;
      position: relative;
      transition: 0.3s ease;
      align-items: center;

      &:after {
        position: absolute;
        width: 65px;
        height: 65px;
        content: '';
        border: 1px dashed rgba(112, 112, 112, 0.4);
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
      }

      &:before {
        position: absolute;
        width: 75px;
        height: 75px;
        content: '';
        border: 1px dashed rgba(112, 112, 112, 0.2);
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
      }
    }

    &-text {
      display: inline-block;
      margin-right: 10px;
      color: rgba(0, 0, 0, 0.6);
      font-size: 16px;
    }

    &-icon {
      display: inline-block;
      margin-top: 8px;
    }
  }
`;
const StepNav = ({
                     step = 1,
                     steps = ['Добавление продукта', 'Добавление параметров', 'Калькуляция', 'Франшиза', 'Проверка данных', 'Подтверждение'],
                     ...rest
                 }) => {
    const {t} = useTranslation()
    return (
        <Styled {...rest}>
            {
                steps && steps.map((item, i) => <li
                    className={classNames('step-item', {active: includes(range(0, step + 1), i + 1)})}>
                    <span className={'step-number'}>{i + 1}</span>
                    <span className={'step-text'}>{t(item)}</span>
                    <span className={'step-icon'}>
                    { i+1 < steps.length && <ChevronRight size={18} color={includes(range(0, step + 1), i + 1) ? '#000' : '#E5E5E5'}/>}
                </span>
                </li>)
            }
        </Styled>
    );
};

export default StepNav;