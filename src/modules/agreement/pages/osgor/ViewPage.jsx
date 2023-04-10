import React from 'react';
import styled from "styled-components";
import ViewContainer from "../../containers/osgor/ViewContainer";
import {useParams} from "react-router-dom";

const Styled = styled.div`
  .w-100 {
    & > div {
      width: 100%;
    }
  }
`;
const ViewPage = ({...rest}) => {
    const {form_id = null} = useParams();
    return (
        <Styled {...rest}>
            <ViewContainer form_id={form_id}/>
        </Styled>
    );
};

export default ViewPage;