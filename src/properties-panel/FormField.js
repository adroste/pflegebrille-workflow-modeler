import { Checkbox, Form, Input } from 'antd';

import { FormTypeEnum } from '../meta-model/enum/FormTypeEnum';
import { FunctionSelect } from './fields/FunctionSelect';
import { MediaFileInput } from './fields/MediaFileInput';
import React from 'react';

export function FormField({
    businessObject,
    binding: {
        property,
        type,
        label,
        functionMap,
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


        case FormTypeEnum.FUNCTION_SELECT:
            return (
                <Form.Item
                    name={property}
                    label={label}
                >
                    <FunctionSelect 
                        businessObject={businessObject} 
                        functionMap={functionMap}
                    />
                </Form.Item>
            );

        case FormTypeEnum.MEDIA_FILE:
            return (
                <Form.Item
                    name={property}
                    label={label}
                >
                    <MediaFileInput />
                </Form.Item>
            );

        case FormTypeEnum.DATA_INPUT:
        case FormTypeEnum.DATA_OUTPUT:
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