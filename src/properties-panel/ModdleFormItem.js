import { Form, Input } from 'antd';

import React from 'react';

export function ModdleFormItem({
    name,
    label,
    type
}) {
    switch (type) {
        case 'MultilineText':
            return (
                <Form.Item
                    name={name}
                    label={label}
                >
                    <Input.TextArea autoSize={{ minRows: 3 }} />
                </Form.Item>
            );

        case 'MediaFile':
            return (
                <Form.Item
                    name={name}
                    label={label}
                >
                    <Input />
                </Form.Item>
            );

        default:
            return null;
    }
}