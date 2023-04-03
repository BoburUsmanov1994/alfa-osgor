import React from 'react';
import styled from "styled-components";
import AgreementCreateContainer from "../../containers/osgor/AgreementCreateContainer";

const Styled = styled.div`
    .form-group{
      margin-bottom: 0;
    }
  
`;
const AgreementCreatePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <AgreementCreateContainer/>
        </Styled>
    );
};

export default AgreementCreatePage;