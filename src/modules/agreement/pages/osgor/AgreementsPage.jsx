import React from 'react';
import styled from "styled-components";
import AgreementsContainer from "../../containers/osgor/AgreementsContainer";

const Styled = styled.div`
`;
const AgreementsPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <AgreementsContainer/>
        </Styled>
    );
};

export default AgreementsPage;