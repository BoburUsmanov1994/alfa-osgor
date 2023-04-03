import React from 'react';
import styled from "styled-components";
import {ceil, isEqual, range} from "lodash"
import classNames from "classnames";
import {ChevronLeft,ChevronRight} from "react-feather";

const Styled = styled.ul`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  margin-top: 25px;
flex-wrap: wrap;
  li {
    width: 40px;
    height: 40px;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #CCCCCC;
    color: #A4A4A4;
    font-family: 'Gilroy-Medium', sans-serif;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    margin-right: 10px;
    cursor: pointer;
    margin-bottom: 5px;
    &:last-child{
      margin-right: 0;
    }

    &.active {
      background-color: #13D6D1;
      border-color: #13D6D1;
      color: #fff;
    }
  }
`;
const Pagination = ({
                        totalItems = 0,
                        limit = 20,
                        page = 1,
                        setPage = () => {
                        },
                        ...rest
                    }) => {
    const count = ceil(totalItems / limit)
    return (
        <Styled {...rest}>
            {!!(page > 1) && <li onClick={()=>setPage(page-1)} className={'prev'}>
                <ChevronLeft />
            </li>}
            {
                count > 1 && range(1, count + 1).map(item => <li className={classNames({'active':isEqual(page,item)})} onClick={()=>setPage(item)} key={item}>
                    {item}
                </li>)
            }
            {!!(count > 1 && page < count) && <li onClick={()=>setPage(page+1)} className={'next'}>
                <ChevronRight />
            </li>}
        </Styled>
    );
};

export default Pagination;