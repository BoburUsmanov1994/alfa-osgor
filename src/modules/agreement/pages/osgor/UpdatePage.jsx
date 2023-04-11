import React from 'react';
import styled from "styled-components";
import UpdateContainer from "../../containers/osgor/UpdateContainer";
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
const UpdatePage = ({...rest}) => {
    const {form_id = null} = useParams();
    return (
        <Styled {...rest}>
            <UpdateContainer form_id={form_id}/>
        </Styled>
    );
};

export default UpdatePage;