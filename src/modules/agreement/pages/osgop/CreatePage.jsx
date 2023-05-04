import React from 'react';
import styled from "styled-components";
import CreateContainer from "../../containers/osgop/CreateContainer";

const Styled = styled.div`
  .form-group {
    margin-bottom: 0;
  }

`;
const CreatePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <CreateContainer />
        </Styled>
    );
};

export default CreatePage;