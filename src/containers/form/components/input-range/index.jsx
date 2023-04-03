import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {get, range} from "lodash";
import {ErrorMessage} from "@hookform/error-message";
import Label from "../../../../components/ui/label";
import classNames from "classnames";
import Slider from 'rc-slider';

const Handle = Slider.Handle;

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

    &.error {
      border-color: #ef466f;
    }

    &:focus {
      border-color: #13D6D1;
    }
  }

  .range-input {
    margin-bottom: 25px;
    margin-top: 20px;
    max-width: 400px;
    display: none;
  }
`;
const InputRange = ({
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

    const [val,setVal] = useState(0);

    useEffect(() => {
        setVal(defaultValue)
    }, [defaultValue])



    useEffect(()=>{
        setValue(name,val)
    },[val])

   const handle = props => {
        const { ...restProps } = props;
        return (
            <h2 title={'test'} placement="top">
                <Handle value={'test'} {...restProps} />
            </h2>
        );
    };

    return (
        <Styled {...rest}>
            <div className="form-group">
                <Label
                    className={classNames({required: get(property, 'hasRequiredLabel', false)})}>{label ?? name}</Label>
                <div className={'range-input'}>
                    <Slider
                        trackStyle={[{background: '#13D6D1'}]}
                        step={get(property,'step',25)}
                        marks={get(property,'marks',{0:0,25:25,50:50,75:75,100:100})}
                        min={get(property,'min',0)}
                        max={get(property,'max',100)}
                        dots={true}
                        onChange={(value)=>setVal(value)}
                        value={val}
                    />
                </div>
                <input
                    className={classNames('form-input', {error: get(errors, `${name}`, false)})}
                    placeholder={get(property, "placeholder")}
                    type={get(property, "type", "number")}
                    disabled={get(property, "disabled")}
                    defaultValue={defaultValue}
                    value={val}
                    onChange={(e)=>setVal(e.target.value)}
                />
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

export default InputRange;