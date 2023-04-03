import React from 'react';
import styled from "styled-components";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";

const Styled = styled.div`
  .react-tabs__tab--selected {
    border-radius: unset !important;
    border-bottom-color: ${({success}) => success ? '#13D6D1 !important' : '#1D283A !important'};
  }

  .react-tabs__tab {
    padding: 10px 25px;
    color: #000;
    border: none;
    border-bottom: 7px solid #F0F0F0;
    min-width: 150px;
    text-align: center;
    position: unset;

    &:focus {
      outline: none !important;
      border-bottom: 7px solid #F0F0F0;
    }
  }

  .react-tabs__tab-list {
    border: none !important;
    display: flex;
    margin-bottom: 30px;
  }
`;
const CustomTabs = ({
                        header = [],
                        body = [],
                        ...rest
                    }) => {
    return (
        <Styled {...rest}>
            <Tabs>
                <TabList>
                    {
                        header && header.map((item, i) => <Tab key={i + 1}>{item}</Tab>)
                    }
                </TabList>

                {
                    body && body.map((item, i) => <TabPanel key={i + 1}>
                        {
                            item
                        }
                    </TabPanel>)
                }

            </Tabs>
        </Styled>
    );
};

export default CustomTabs;