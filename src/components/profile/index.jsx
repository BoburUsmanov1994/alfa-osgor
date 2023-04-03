import React from 'react';
import styled from "styled-components";
import {User,ChevronDown} from "react-feather";
import {useStore} from "../../store";
import {get} from "lodash";

const Styled = styled.div`
  margin-left: 20px;
  border: 1px solid #C2C2C2;
  padding: 8px 16px;
  -webkit-border-radius: 50px;
  -moz-border-radius: 50px;
  border-radius: 50px;
  max-width: 350px;
  display: flex;
  align-items: center;
  

  .username {
    font-size: 15px;
    display: inline-block;
    margin-right: 8px;
    margin-top: 3px;
    max-width: 350px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .user-icon{
    margin-right: 12px;
    line-height: 1;
  }
  .chevron-icon{
    margin-top: 3px;
  }
`

const Profile = ({
                     username = 'Admin',
                     ...rest
                 }) => {
    const user = useStore(state=>get(state,'user',{})) || 'ADMIN'
    return (
        <Styled {...rest}>
            <User className={'user-icon'} size={26}/>
            <span className={'username'}>{get(user,'email','test')}({get(user,'accountrole.name','ADMIN')})</span>
            <ChevronDown className={'chevron-icon'} size={22} />
        </Styled>
    );
};

export default Profile;