import { Form, Input } from 'antd';
import React, { useCallback, useContext, useEffect } from 'react';

import { modelerContext } from '../modeler/ModelerContextProvider';

export function BaseProperties({
    element, // warn: element will be mutated by bpmnjs
}) {
    const { modeling } = useContext(modelerContext);
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            id: element.id,
            name: element.businessObject.name,
        });
    });

    const handleIdChange = useCallback(e => {
        // todo check id is unique and not empty or disable
        modeling.updateProperties(element, {
            'id': e.target.value
        });
    }, [element, modeling]);

    const handleNameChange = useCallback((e) => {
        modeling.updateLabel(element, e.target.value);
    }, [element, modeling]);

    return (
        <Form
            form={form}
            layout='vertical'
        >
            <Form.Item
                name="id"
                label="ID"
            >
                <Input disabled onChange={handleIdChange} />
            </Form.Item>

            <Form.Item
                name="name"
                label="Name"
            >
                <Input onChange={handleNameChange} />
            </Form.Item>
        </Form>
    );
}
