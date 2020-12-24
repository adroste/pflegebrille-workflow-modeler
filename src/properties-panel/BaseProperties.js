import { Form, Input } from 'antd';
import React, { useCallback, useContext, useEffect } from 'react';

import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { modelerContext } from '../modeler/ModelerContextProvider';

export function BaseProperties({
    element, // warn: element will be mutated by bpmnjs
}) {
    const { modeling } = useContext(modelerContext);
    const [form] = Form.useForm();

    const businessObject = getBusinessObject(element);
    const hasName = businessObject.$descriptor?.properties.find(p => p.name === 'name');

    useEffect(() => {
        form.setFieldsValue({
            name: businessObject.name,
        });
    });

    const handleNameChange = useCallback((e) => {
        modeling.updateLabel(element, e.target.value);
    }, [element, modeling]);

    return (
        <Form
            form={form}
            layout='vertical'
        >
            <Form.Item>
                ID: {element.id}
            </Form.Item>

            {hasName &&
                <Form.Item
                    name="name"
                    label="Name"
                >
                    <Input onChange={handleNameChange} />
                </Form.Item>
            }
        </Form>
    );
}
