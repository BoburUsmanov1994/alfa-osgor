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
`;
const ViewPage = ({...rest}) => {
    const {application_number = null} = useParams();
    return (
        <Styled {...rest}>
            <ViewContainer application_number={application_number}/>
        </Styled>
    );
};

export default ViewPage;