import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import Label from "../../../../components/ui/label";
import classNames from "classnames";
import {get, isEmpty} from "lodash";
import {ErrorMessage} from "@hookform/error-message";
import {Radio, RadioGroup} from '@chakra-ui/react'


const Styled = styled.div`
  .chakra-radio__control {
    width: 18px;
    height: 18px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    border:1px solid #13D6D1;
    background-clip: content-box;
    padding: 2px;
    &[data-checked]{
      background-color: #13D6D1;
    }
  }
  .chakra-radio-group{
    display: flex;
    flex-wrap: wrap;
  }
  .chakra-radio{
    margin-right: 15px;
    margin-bottom: 10px;
    &:last-child{
      margin-right: 0;
      margin-bottom: 0;
    }
  }
`;

const RadioGroupComponent = ({
                                 Controller,
                                 control,
                                 register,
                                 disabled = false,
                                 name,
                                 errors,
                                 params,
                                 property,
                                 defaultValue,
                                 getValues,
                                 watch,
                                 label,
                                 setValue,
                                 getValueFromField = () => {
                                 },
                                 options = [],
                                 ...rest
                             }) => {
    const [val, setVal] = useState(null)
    useEffect(() => {
        setVal(defaultValue);
    }, [defaultValue])

    useEffect(() => {
        setValue(name, val)
    }, [val])
    return (
        <Styled {...rest}>
            <div className="form-group">
                <Label
                    className={classNames('checkbox-label', {required: get(property, 'hasRequiredLabel', false)})}>{label ?? name}</Label>
                <RadioGroup  onChange={setVal} value={val}>

                    {
                        options && options.map((option, i) => <Radio  key={i + 1} value={get(option, 'value')}>{
                            get(option, 'label')
                        }</Radio>)
                    }
                </RadioGroup>

                <ErrorMessage
                    errors={errors}
                    name={name}
                    render={({messages = `${label} is required`}) => {

                        if (errors[name].type == 'required') {
                            messages = `${label} is required`;
                        }
                        if (errors[name].type == 'pattern') {
                            messages = `${label} is not valid`;
                        }
                        if (errors[name].type == 'manual') {
                            messages = `${label} ${errors[name].message}`;
                        }
                        return <small className="form-error-message"> {messages}</small>;
                    }}
                />
            </div>
        </Styled>
    );
};

export default RadioGroupComponent;