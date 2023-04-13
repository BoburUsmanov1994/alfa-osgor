import React,{useEffect} from 'react';
import styled from "styled-components";
import {get, includes, isEmpty} from "lodash";
import { ErrorMessage } from "@hookform/error-message";
import Label from "../../../../components/ui/label";
import classNames from "classnames";

const Styled = styled.div`
  .form-input {
    display: block;
    min-width: 275px;
    width: 100%;
    padding: 12px 18px;
    color: #000;
    font-size: 16px;
    border: 1px solid #BABABA;
    border-radius: 5px;
    outline: none;
    max-width: 400px;
    font-family: 'Gilroy-Regular', sans-serif;
    &.error{
      border-color: #ef466f;
    }
    &:focus {
      border-color: #13D6D1;
    }
  }
`;
const Input = ({
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

    useEffect(()=>{
        setValue(name,defaultValue)
    },[defaultValue])

    useEffect(() => {
        getValueFromField(getValues(name), name);
    }, [watch(name)]);

    return (
        <Styled {...rest}>
            <div className="form-group">
                {!get(property,'hideLabel',false) && <Label className={classNames({required:get(property,'hasRequiredLabel',false)})}>{label ?? name}</Label>}
                {get(property, "type") == 'number' ? <input
                    className={classNames('form-input',{error:get(errors,`${name}`,false)})}
                    name={name}
                    {...register(name, params)}
                    placeholder={get(property, "placeholder")}
                    type={'number'}
                    disabled={get(property, "disabled")}
                    defaultValue={defaultValue}
                    min={0}
                    max={25}
                /> : <input
                    className={classNames('form-input',{error:get(errors,`${name}`,false)})}
                    name={name}
                    {...register(name, params)}
                    placeholder={get(property, "placeholder")}
                    type={get(property, "type", "text")}
                    disabled={get(property, "disabled")}
                    defaultValue={defaultValue}
                    min={0}
                />}
                <ErrorMessage
                    errors={errors}
                    name={name}
                    render={({ messages = 'Field is required' }) => {
                            if (get(get(errors,name),'type') == 'required') {
                                messages = `${label ?? name} is required`;
                            }
                            if (get(get(errors,name),'type') == "pattern") {
                                messages = `${label ?? name} is not valid format`;
                            }
                            if (get(get(errors,name),'type') == 'manual') {
                                messages = `${label ?? name} ${errors[name].message}`;
                            }
                        return <small className="form-error-message"> {messages}</small>;
                    }}
                />
            </div>
        </Styled>
    );
};

export default Input;