import React from 'react';
import styled from "styled-components";
import {get} from "lodash"
import {ContentLoader} from "../../../components/loader";
import {useTranslation} from "react-i18next";


const Styled = styled.table`
  width: 100%;
  text-align: left;
  margin-top: 15px;

  tr {
    vertical-align: middle;
  }

  .table-head {
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
`;
const GridTable = ({
                       tableHeaderData = [],
                       tableBodyData = [],
                       TableBody,
                       remove = () => {
                       },
                       openEditModal = () => {
                       },
                       isFetching = false,
                       page,
                       viewUrl = null,
                       updateUrl = null,
                       dataKey = null,
                       ...rest
                   }) => {
    const {t} = useTranslation()
    return (
        <Styled {...rest}>
            {isFetching && <ContentLoader/>}
            <thead className={'table-head'}>
            <tr>
                <th>№</th>
                {
                    tableHeaderData && tableHeaderData.map((th, i) => <th key={get(th, 'id', i)}>
                        {
                            t(get(th, 'title', '-'))
                        }
                    </th>)

                }
                <th>{t("Actions")}</th>
            </tr>
            </thead>
            <tbody className={'table-body'}>
            <TableBody dataKey={dataKey} viewUrl={viewUrl} updateUrl={updateUrl} page={page} remove={remove} openEditModal={openEditModal} tableHeaderData={tableHeaderData}
                       tableBodyData={tableBodyData}/>
            </tbody>
        </Styled>
    );
};

export default GridTable;