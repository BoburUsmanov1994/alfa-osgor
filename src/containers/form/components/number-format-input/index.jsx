import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {get, hasIn, isEmpty, isFunction,isNil} from "lodash";
import {ErrorMessage} from "@hookform/error-message";
import Label from "../../../../components/ui/label";
import NumberFormat from 'react-number-format';

const Styled = styled.div`
  .masked-input {
    display: block;
    min-width: 275px;
    width: 100%;
    padding: 12px 18px;
    color: #000;
    font-size: 16px;
    border: 1px solid #BABABA;
    border-radius: 5px;
    outline: none;
    font-family: 'Gilroy-Regular', sans-serif;
    max-width: 400px;
    &.error{
      border-color: #ef466f;
    }

    &:focus {
      border-color: #13D6D1;
    }
  }
`;
const NumberFormatInput = ({
                         Controller,
                         control,
                         register,
                         disabled = false,
                         name,
                         errors,
                         params,
                         property,
                         defaultValue=0,
                         getValues,
                         watch,
                         label,
                         setValue,
                         getValueFromField = () => {
                         },
                         ...rest
                     }) => {

    const [val,setVal] = useState(0)

    useEffect(() => {
        if(!isNil(defaultValue)) {
            setVal(defaultValue)
        }
    }, [defaultValue])

    useEffect(() => {
        setValue(name, val)
        if(get(property,'onChange') && isFunction(get(property,'onChange'))) {
            get(property, 'onChange')(val)
        }
    }, [val])

    useEffect(() => {
        getValueFromField(getValues(name), name);
    }, [watch(name)]);
    return (
        <Styled {...rest}>
            <div className="form-group">
                {!get(property,'hideLabel',false) && <Label>{label ?? name}</Label>}
                <Controller
                    as={NumberFormat}
                    control={control}
                    name={name}
                    defaultValue={defaultValue}
                    rules={params}
                    render={({field}) => (
                        <NumberFormat
                            {...field}
                            value={val}
                            className={`masked-input ${hasIn(errors,name) ? "error" : ''}`}
                            placeholder={get(property, "placeholder")}
                            suffix={get(property, "suffix",'')}
                            thousandSeparator={get(property, "thousandSeparator"," ")}
                            isNumericString={true}
                            onValueChange={(value) => setVal(value.floatValue)}
                            allowNegative={get(property, "allowNegative",false)}
                            disabled={get(property,'disabled',false)}
                        />
                    )}
                />
                <ErrorMessage
                    errors={errors}
                    name={name}
                    render={({messages = `${label ?? name} is required`}) => {

                        if (errors[name].type == 'required') {
                            messages = `${label ?? name} is required`;
                        }
                        if (errors[name].type == 'pattern') {
                            messages = `${label ?? name} is not valid`;
                        }
                        if (errors[name].type == 'manual') {
                            messages = `${label ?? name} ${errors[name].message}`;
                        }
                        return <small className="form-error-message"> {messages}</small>;
                    }}
                />
            </div>
        </Styled>
    );
};

export default NumberFormatInput;