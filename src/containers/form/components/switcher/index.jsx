import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import Label from "../../../../components/ui/label";
import Switch from "react-switch";
import Flex from "../../../../components/flex";
import classNames from "classnames";
import {get, head, last} from "lodash";

const Styled = styled.div`
  .switch {
    margin: 0 16px;
  }

  span {
    font-family: 'Gilroy-Medium', sans-serif;
  }

  label {
    margin-bottom: 15px;
  }
`;
const Switcher = ({
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
                      options = [
                          {
                              value: false,
                              label: 'Нет'
                          },
                          {
                              value: true,
                              label: 'Да'
                          },
                      ],
                      ...rest
                  }) => {
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        setChecked(defaultValue)
    }, [defaultValue])

    useEffect(() => {
        if (checked) {
            setValue(name, get(last(options), 'value', true))
        } else {
            setValue(name, get(head(options), 'value', false))
        }

    }, [checked])

    useEffect(() => {
        getValueFromField(getValues(name), name);
    }, [watch(name)]);
    return (
        <Styled {...rest}>
            <div className="form-group">
                {!get(property, 'hideLabel', false) && <Label
                    className={classNames({required: get(property, 'hasRequiredLabel', false)})}>{label ?? name}</Label>}
                <Flex>
                    <span>{get(head(options), 'label', '-')}</span>
                    <Switch
                        checked={checked}
                        onChange={(val) => {
                            setChecked(val);
                            property?.handleChange(val)
                        }}
                        onColor={'#5BBA7C'}
                        offColor={'#C8C8C8'}
                        activeBoxShadow={'0 0 2px 3px #5BBA7C'}
                        className={'switch'}
                        disabled={disabled}
                    />
                    <span>{get(last(options), 'label', '-')}</span>
                </Flex>
            </div>
        </Styled>
    );
};

export default Switcher;