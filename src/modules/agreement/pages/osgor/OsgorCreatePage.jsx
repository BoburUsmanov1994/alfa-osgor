import React from 'react';
import styled from "styled-components";
import OsgorCreateContainer from "../../containers/osgor/OsgorCreateContainer";

const Styled = styled.div`
  .form-group {
    margin-bottom: 0;
  }

`;
const OsgorCreatePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <OsgorCreateContainer/>
        </Styled>
    );
};

export default OsgorCreatePage;