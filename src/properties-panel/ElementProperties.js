import React, { useCallback, useContext, useEffect } from 'react';

import { Form } from 'antd';
import { ModdleFormItem } from './ModdleFormItem';
import { getAllowedFunctionsForType } from '../model/modelUtil';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { modelerContext } from '../base/ModelerContextProvider';

export function ElementProperties({
    element,
}) {
    const { modeling, moddle } = useContext(modelerContext);
    const [form] = Form.useForm();

    const elementId = element?.id;
    const businessObject = getBusinessObject(element);
    const allowedFunctions = getAllowedFunctionsForType(businessObject.$type);
    const selectedFunction = allowedFunctions[0];

    useEffect(() => {
        form.resetFields();
        const extensionElements = businessObject.extensionElements;
        if (extensionElements) {
            let exElement = extensionElements.get('values').find(el => el.$instanceOf('pb:Function'));
            form.setFieldsValue(exElement);
        }
    }, [businessObject, form, elementId]);

    const updateElementProperties = useCallback(updatedValues => {
        const type = selectedFunction && `pb:${selectedFunction.name}`;
        const extensionElements = businessObject.extensionElements || moddle.create('bpmn:ExtensionElements');

        let exElement = extensionElements.get('values').find(el => el.$instanceOf(type));

        if (!exElement) {
            exElement = moddle.create(type);
            extensionElements.get('values').push(exElement);
        }

        Object.assign(exElement, updatedValues);

        modeling.updateProperties(element, {
            extensionElements,
        });
    }, [businessObject.extensionElements, element, moddle, modeling, selectedFunction]);

    return (
        <Form
            form={form}
            layout='vertical'
            onValuesChange={updateElementProperties}
        >
            {selectedFunction?.properties.map(({ name, meta: { formLabel, formType } }) => (
                <ModdleFormItem
                    key={name}
                    name={name}
                    label={formLabel}
                    type={formType}
                />
            ))}
        </Form>
    );
}
