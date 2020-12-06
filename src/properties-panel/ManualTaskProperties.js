import { Form, Input } from 'antd';
import React, { useCallback, useContext, useEffect } from 'react';

import { modelerContext } from '../base/ModelerContextProvider';

export function ManualTaskProperties({
    element, // warn: element will be mutated by bpmnjs
}) {
    const { modeling } = useContext(modelerContext);
    const [form] = Form.useForm();

    useEffect(() => {
        // form.setFieldsValue({
        //     id: element.id,
        //     name: element?.businessObject.name,
        // });
    });

    const handleIdChange = useCallback(e => {
        // todo check id is unique and not empty or disable
        // modeling.updateProperties(element, {
        //     'id': e.target.value
        // });
    }, [element, modeling]);

    const handleNameChange = useCallback((e) => {
        // modeling.updateLabel(element, e.target.value);
    }, [element, modeling]);

    return (
        <Form
            form={form}
            layout='vertical'
        >
            <Form.Item
                name="text"
                label="Text"
                // rules={[{ required: true }]}
            >
                <Input.TextArea 
                    autoSize={{ minRows: 3 }}
                    onChange={handleIdChange} 
                />
            </Form.Item>

            <Form.Item
                name="media"
                label="Bild / Video"
                // rules={[{ required: true }]}
            >
                <Input onChange={handleNameChange} />
            </Form.Item>
        </Form>
    );
}
