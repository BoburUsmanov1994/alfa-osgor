import React from 'react';
import styled from "styled-components";
import AgreementViewContainer from "../../containers/osgor/AgreementViewContainer";
import {useParams} from "react-router-dom";

const Styled = styled.div`
  .w-100 {
    & > div {
      width: 100%;
    }
  }
`;
const AgreementViewPage = ({...rest}) => {
    const {id = null} = useParams();
    return (
        <Styled {...rest}>
            <AgreementViewContainer id={id}/>
        </Styled>
    );
};

export default AgreementViewPage;