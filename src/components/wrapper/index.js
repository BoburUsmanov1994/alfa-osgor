import React from 'react';
import styled from "styled-components";

const StyledWrapper = styled.div`
@media screen and (max-width:1300px){

}
`;
const Wrapper = (props) => {
    return (
        <StyledWrapper  {...props}/>
    );
};

export default Wrapper;