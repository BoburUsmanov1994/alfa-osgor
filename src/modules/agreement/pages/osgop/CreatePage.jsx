import React from 'react';
import styled from "styled-components";
import CreateContainer from "../../containers/osgop/CreateContainer";

const Styled = styled.div`
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
const CreatePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <CreateContainer/>
        </Styled>
    );
};

export default CreatePage;