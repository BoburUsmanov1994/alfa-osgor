import React from 'react';
import styled from "styled-components";
import FormConsumer from "../../context/form/FormConsumer";
import Input from "./components/input";
import CustomSelect from "./components/select";
import Switcher from "./components/switcher";
import MaskedInput from "./components/masked-input";
import Checkbox from "./components/checkbox";
import CustomDropzone from "./components/dropzone";
import NumberFormatInput from "./components/number-format-input";
import RadioGroupComponent from "./components/radio-group";
import InputRange from "./components/input-range";
import CustomDatepicker from "./components/datepicker";

const StyledField = styled.div`
  //margin-bottom: 25px;
`;
const Field = ({type, ...rest}) => {
    return (
        <StyledField>
            {
                ((type) => {
                    switch (type) {
                        case 'input':
                            return <FormConsumer>{({attrs, getValueFromField}) => <Input {...rest} {...attrs}
                                                                                         getValueFromField={getValueFromField}/>}</FormConsumer>;
                        case 'select':
                            return <FormConsumer>{({attrs, getValueFromField}) => <CustomSelect {...rest} {...attrs}
                                                                                                getValueFromField={getValueFromField}/>}</FormConsumer>;
                        case 'switch':
                            return <FormConsumer>{({attrs, getValueFromField}) => <Switcher {...rest} {...attrs}
                                                                                            getValueFromField={getValueFromField}/>}</FormConsumer>;
                        case 'input-mask':
                            return <FormConsumer>{({attrs, getValueFromField}) => <MaskedInput {...rest} {...attrs}
                                                                                               getValueFromField={getValueFromField}/>}</FormConsumer>;
                        case 'checkbox':
                            return <FormConsumer>{({attrs, getValueFromField}) => <Checkbox {...rest} {...attrs}
                                                                                            getValueFromField={getValueFromField}/>}</FormConsumer>;
                        case 'dropzone':
                            return <FormConsumer>{({attrs, getValueFromField}) => <CustomDropzone {...rest} {...attrs}
                                                                                                  getValueFromField={getValueFromField}/>}</FormConsumer>;
                        case 'number-format-input':
                            return <FormConsumer>{({attrs, getValueFromField}) => <NumberFormatInput {...rest} {...attrs}
                                                                                                  getValueFromField={getValueFromField}/>}</FormConsumer>;
                        case 'radio-group':
                            return <FormConsumer>{({attrs, getValueFromField}) => <RadioGroupComponent {...rest} {...attrs}
                                                                                                     getValueFromField={getValueFromField}/>}</FormConsumer>;
                        case 'input-range':
                            return <FormConsumer>{({attrs, getValueFromField}) => <InputRange {...rest} {...attrs}
                                                                                                       getValueFromField={getValueFromField}/>}</FormConsumer>;
                        case 'datepicker':
                            return <FormConsumer>{({attrs, getValueFromField}) => <CustomDatepicker {...rest} {...attrs}
                                                                                              getValueFromField={getValueFromField}/>}</FormConsumer>;
                        default:
                            return "input"
                    }

                })(type)
            }
        </StyledField>
    )
}

export default Field;
