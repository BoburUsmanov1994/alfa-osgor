import React, {useEffect, useState,memo} from 'react';
import styled,{css} from "styled-components";
import Select, {components} from "react-select";
import caretDown from "../../../../assets/images/caret-down.png";
import {ErrorMessage} from "@hookform/error-message";
import Label from "../../../../components/ui/label";
import {get, includes, isEmpty, isNil} from "lodash";
import classNames from "classnames";

const StyledFormSelect = styled.div`
  width: 100%;

  .error__control {
    border-color: #ef466f;
  }
  .form-select__menu{
    max-width: 400px;
  }
  .form-select__control--is-disabled{
    background-color: #BABABA;
  }
  .form-select__control{
    background-color: ${({bgColor}) => bgColor ?? ''};
    border-color: ${({bgColor}) => bgColor ?? ''};
    .form-select__single-value{
      color: #000;
    }
    .form-select__indicators{
      display: ${({bgColor}) => bgColor ? 'none' : ''};;
    }
  }
  ${({fullWidth})=>fullWidth && css`
    .form-select__control{
      max-width: 100% !important;
      min-width: 400px !important;
    }
  `}


  
`;

const DropdownIndicator = props => {
    return (
        components.DropdownIndicator && (
            <components.DropdownIndicator {...props}>
                <img src={caretDown} alt=""/>
            </components.DropdownIndicator>
        )
    );
};
const customStyles = {

    control: (base, state, error) => ({
        ...base,
        background: "#fff",
        borderColor: error ? "#ef466f" : "#BABABA",
        borderRadius: '5px',
        outline: "none",
        boxShadow: "none",
        color: "#7E7E7E",
        display: "flex",
        overflow: 'hidden',
        padding: '4px 12px',
        width: '100%',
        minHeight: '40px',
        maxWidth: '400px',
        fontSize: '16px',
        fontWeight: '300',
        "&:hover": {
            borderColor: '#13D6D1',
            outline: "none",
        },
        "&:focus": {
            borderColor: '#13D6D1',
            outline: "none",
        }
    }),
    indicatorSeparator: (base, state) => ({
        ...base,
        display: 'none'
    })
};

const FormSelect = ({
                        options = [],
                        setValue,
                        label,
                        name,
                        validation,
                        error,
                        defaultValue = null,
                        disabled = false,
                        Controller,
                        control,
                        params = {},
                        property = {},
                        onChange = (value) => {
                            console.log(value)
                        },
                        isMulti = false,
                        isDisabled = false,
                        errors,
                        watch,
                        getValueFromField = () => {
                        },
                        getValues = () => {
                        },
                        ...props
                    }) => {

    const [selectedValue, setSelectedValue] = useState(null)

    useEffect(() => {
        if(!isNil(defaultValue)) {
            if (isMulti) {
                if (!isEmpty(defaultValue)) {
                    setSelectedValue(defaultValue)
                }
            } else {
                setSelectedValue(defaultValue)
            }
        }

    }, [defaultValue])

    const handleChange = (value) => {
        if(isMulti){
            setSelectedValue(value.map(item => item.value))
        }else {
            setSelectedValue(value.value);
        }
    }

    useEffect(()=>{
        setValue(name,selectedValue)
    },[selectedValue])

    useEffect(() => {
        getValueFromField(getValues(name), name);
    }, [watch(name),selectedValue]);

    return (
        <>
            <div className="form-group">
                {!get(property, 'hideLabel', false) && <Label
                    className={classNames({required: get(property, 'hasRequiredLabel', false)})}>{label ?? name}</Label>}

                <StyledFormSelect {...props} large={get(property,'large',false)} fullWidth={get(property,'fullWidth',false)} bgColor={get(property,'bgColor')}>
                    <Controller
                        control={control}
                        name={name}
                        rules={params}
                        render={() => (
                            <Select
                                clearIndicator={true}
                                options={options}
                                placeholder={get(property, 'placeholder', 'Select...')}
                                onChange={handleChange}
                                styles={customStyles}
                                components={{DropdownIndicator}}
                                isMulti={isMulti}
                                isDisabled={disabled}
                                className={classNames('form-select',{isDisabled:isDisabled})}
                                classNamePrefix={classNames('form-select', {error: get(errors, `${name}`, false)})}
                                value={
                                    isMulti ? options.filter(option=>includes(selectedValue,option.value)) : options.filter(option =>
                                        option.value === selectedValue)
                                }
                            />
                        )}
                    />

                </StyledFormSelect>
                <ErrorMessage
                    errors={errors}
                    name={name}
                    render={({messages = `${label} is required`}) => {

                        if (errors[name]?.type == 'required') {
                            messages = `${label} is required`;
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

        </>
    );
};

export default memo(FormSelect);