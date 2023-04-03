import React from 'react';
import styled,{css}  from "styled-components";
import classNames from "classnames";

const Styled = styled.table`
  width: 100%;
  //overflow-x: scroll;
  border:0;
 

  .form-group {
    margin-bottom: 0;
  }

  tr {
    vertical-align: middle;
  }

  .table-head {
    &.hidden {
      opacity: 0;
    }

    th {
      padding: 12px;
      color: #010101;
      font-family: 'Gilroy-Medium', sans-serif;
      font-size: 16px;

      &:first-child {
        text-align: left;
        padding-left: 20px;
      }

      text-align: center;

      &:last-child {
        text-align: right;
        padding-right: 20px;
        min-width: 125px;
      }
    }
  }

  .table-body {
    tr:nth-child(2n+1) {
      background-color: #F4F4F4;
    }

    td {
      padding: 12px;
      font-family: 'Gilroy-Regular', sans-serif;
      color: #000;

      .w-250 {
        min-width: 250px !important;
      }

      &:first-child {
        text-align: left;
        padding-left: 20px;
      }

      text-align: center;

      &:last-child {
        text-align: right;
        padding-right: 20px;
      }
    }
  }
  ${({bordered}) => bordered && css`
    td,th{
      border:1px solid #9D9D9D;
    }
  `}

  
`;

const Table = ({
                   thead = [],
                   children,
                   hideThead = true,
                   bordered = false,
                   ...rest
               }) => {
    return (
        <Styled bordered={bordered} {...rest}>
            <thead className={classNames('table-head', {hidden: hideThead})}>
            <tr>
                {thead && thead.map((th, i) => <th key={i + 1}>{th}</th>)}
            </tr>
            </thead>
            <tbody className={'table-body'}>
            {children}
            </tbody>
        </Styled>
    );
};

export default Table;