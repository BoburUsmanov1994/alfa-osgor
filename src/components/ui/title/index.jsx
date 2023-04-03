import React, {useEffect, useState,useRef} from 'react';
import styled,{css} from "styled-components";

const Styled = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  h2{
    padding-right: 25px;
    font-size: 24px;
    color: #000;
    font-family: 'Gilroy-Bold', sans-serif;
    margin-bottom: 0;
  }
  .line{
    height: 1px;
    background-color: #E5E5E5;
    margin-top: 5px;
    ${({w}) => w && `width: calc(100% - ${w}px - 10px);`}
  }
  
  ${({sm}) => sm && css`
    h2 {
      font-size: 18px;
    }
  `}
`;
const Title = ({
                   children,
                   ...rest
               }) => {
    const [width,setWidth] = useState(0);
    useEffect(()=>{
        setWidth(ref.current.clientWidth)
    },[])
    const ref = useRef(null)
    return (
        <Styled {...rest} w={width}>
            <h2 ref={ref}>{children}</h2>
            <div className="line"></div>
        </Styled>
    );
};

export default Title;