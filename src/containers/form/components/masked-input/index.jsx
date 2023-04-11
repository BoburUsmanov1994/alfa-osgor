import React, {useEffect} from 'react';
import styled from "styled-components";
import {get, hasIn, includes, isEmpty, isFunction} from "lodash";
import {ErrorMessage} from "@hookform/error-message";
import Label from "../../../../components/ui/label";
import InputMask from 'react-input-mask';

const Styled = styled.div`
  .masked-input {
    display: block;
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
const MaskedInput = ({
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
                         ...rest
                     }) => {

    useEffect(() => {
        setValue(name, defaultValue)
    }, [defaultValue])
    useEffect(()=>{
        if(watch(name)){
           if(isFunction(get(property,'onChange'))){
               get(property,'onChange')(watch(name))
           }
        }
    },[watch(name)])

    return (
        <Styled {...rest}>
            <div className="form-group">
                {!get(property,'hideLabel',false) && <Label>{label ?? name}</Label>}
                <Controller
                    as={InputMask}
                    control={control}
                    name={name}
                    defaultValue={defaultValue}
                    rules={params}
                    render={({field}) => (
                        <InputMask
                            {...field}
                            className={`masked-input text-uppercase ${hasIn(errors,name) ? "error" : ''}`}
                            placeholder={get(property, "placeholder")}
                            mask={get(property, "mask","aa")}
                            maskChar={get(property, "maskChar"," ")}
                            disabled={disabled}
                        />
                    )}
                />
                <ErrorMessage
                    errors={errors}
                    name={name}
                    render={({messages = `${label} is required`}) => {

                        if (errors[name]?.type == 'required') {
                            messages = `${label??name} is required`;
                        }
                        if (errors[name]?.type == 'pattern') {
                            messages = `${label} is not valid`;
                        }
                        if (errors[name]?.type == 'manual') {
                            messages = `${label} ${errors[name].message}`;
                        }
                        return <small className="form-error-message"> {messages}</small>;
                    }}
                />
            </div>
        </Styled>
    );
};

export default MaskedInput;