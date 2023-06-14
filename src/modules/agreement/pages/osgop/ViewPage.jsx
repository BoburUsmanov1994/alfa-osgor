import React from 'react';
import styled from "styled-components";
import ViewContainer from "../../containers/osgop/ViewContainer";
import {useParams} from "react-router-dom";

const Styled = styled.div`
  .w-100 {
    & > div {
      width: 100%;
    }
  }

  .form-group {
    margin-bottom: 0;
  }

  .rodal-dialog {
    height: unset !important;
    max-height: unset !important;
    top: 50% !important;
    bottom: unset !important;
    transform: translateY(-50%);
    min-width: 1000px !important;
    max-width: 60% !important;
  }
`;
const ViewPage = ({...rest}) => {
    const {osgop_formId  = null} = useParams();
    return (
        <Styled {...rest}>
            <ViewContainer osgop_formId ={osgop_formId }/>
        </Styled>
    );
};

export default ViewPage;