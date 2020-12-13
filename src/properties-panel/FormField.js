import { Checkbox, Form, Input } from 'antd';

import { ExtensionFunctionSelect } from './fields/ExtensionFunctionSelect';
import { FormTypeEnum } from '../meta-model/enum/FormTypeEnum';
import React from 'react';

export function FormField({
    businessObject,
    binding: {
        property,
        type,
        label,
    },
}) {
    switch (type) {

        case FormTypeEnum.CHECKBOX:
            return (
                <Form.Item
                    name={property}
                    valuePropName="checked"
                >
                    <Checkbox>{label}</Checkbox> 
                </Form.Item>
            );


        case FormTypeEnum.EXTENSION_FUNCTION_SELECT:
            return (
                <Form.Item
                    name={property}
                    label={label}
                >
                    <ExtensionFunctionSelect businessObject={businessObject} />
                </Form.Item>
            );

        case FormTypeEnum.MEDIA_FILE:
        case FormTypeEnum.TEXT:
            return (
                <Form.Item
                    name={property}
                    label={label}
                >
                    <Input />
                </Form.Item>
            );

        case FormTypeEnum.MULTILINE_TEXT:
            return (
                <Form.Item
                    name={property}
                    label={label}
                >
                    <Input.TextArea autoSize={{ minRows: 3 }} showCount />
                </Form.Item>
            );

        default:
            return null;
    }
}