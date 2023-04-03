import React, {useEffect} from 'react';
import styled from "styled-components";
import {get, includes, isEmpty} from "lodash";
import {ErrorMessage} from "@hookform/error-message";
import Label from "../../../../components/ui/label";
import classNames from "classnames";
import Dropzone from 'react-dropzone'
import {Paperclip} from "react-feather";
import {usePostQuery} from "../../../../hooks/api";
import {URLS} from "../../../../constants/url"
import {KEYS} from "../../../../constants/key"
import {toast} from "react-toastify";
import {ContentLoader} from "../../../../components/loader";

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
    font-family: 'Gilroy-Regular', sans-serif;

    &.error {
      border-color: #ef466f;
    }

    &:focus {
      border-color: #13D6D1;
    }
  }

  button {
    background-color: transparent;
    padding: 10px 15px;
    border: 1px solid #949494;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    color: #000;
    cursor: pointer;
    display: flex;
    align-items: center;
    min-width: 175px;
    justify-content: center;
    font-family: 'Gilroy-Medium', sans-serif;
    font-size: 16px;

    span {
      margin-right: 10px;
    }
  }
`;
const CustomDropzone = ({
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
    const {mutate: uploadFile, isLoading} = usePostQuery({listKeyId: get(property, 'key')})

    useEffect(() => {
        setValue(name, defaultValue)
    }, [defaultValue])

    useEffect(() => {
        getValueFromField(getValues(name), name);
    }, [watch(name)]);

    const upload = (files) => {
        const formData = new FormData();
        formData.append('file', files[0]);

        uploadFile({
            url: get(property, 'url', URLS.contractform), attributes: formData, config: {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
        }, {
            onSuccess: ({data}) => {
                setValue(name, get(data,'data._id'))
            },
            onError: () => {

            }
        })
    }
    return (
        <Styled {...rest}>

            <div className="form-group">
                {!get(property, 'hideLabel', false) && <Label
                    className={classNames({required: get(property, 'hasRequiredLabel', false)})}>{label ?? name}</Label>}
                <Dropzone onDrop={acceptedFiles => upload(acceptedFiles)}>
                    {({getRootProps, getInputProps}) => (
                        <section>
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <button type={'button'}><span>Прикрепить файл</span> <Paperclip size={18}/></button>
                            </div>
                        </section>
                    )}
                </Dropzone>
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

export default CustomDropzone;