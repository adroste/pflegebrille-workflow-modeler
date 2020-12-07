import { Form, Select } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';

import { ModdleFormItem } from './ModdleFormItem';
import { getAllowedFunctionsForType } from '../model/modelUtil';
import { modelerContext } from '../base/ModelerContextProvider';

export function ElementProperties({
    element,
}) {
    const { modeling, moddle } = useContext(modelerContext);
    const [form] = Form.useForm();

    const elementId = element?.id;
    const businessObject = getBusinessObject(element);
    const allowedFunctions = getAllowedFunctionsForType(businessObject.$type);
    const [selectedFunction, setSelectedFunction] = useState(() => {
        if (allowedFunctions.length === 1) {
            return allowedFunctions[0];
        } else if (allowedFunctions.length > 1) {
            const curFunction = businessObject.extensionElements?.values?.find(el => el.$instanceOf('pb:Function'));
            const selectedFunction = curFunction && allowedFunctions.find(f => `pb:${f.name}` === curFunction.$type);
            return selectedFunction;
        }
    });

    const updateElementProperties = useCallback(updatedValues => {
        if (!moddle || !selectedFunction)
            return;

        const type = `pb:${selectedFunction.name}`;
        let extensionElements = businessObject.extensionElements || moddle.create('bpmn:ExtensionElements');

        let functionElements = extensionElements.get('values').filter(el => el.$instanceOf('pb:Function'));
        let exElement = functionElements[0];
        if (functionElements.length > 1 || !is(exElement, type)) {
            extensionElements.values = extensionElements.get('values').filter(el => !el.$instanceOf('pb:Function'));
            exElement = null;
        }

        if (!exElement && type) {
            exElement = moddle.create(type);
            extensionElements.get('values').push(exElement);
        }

        Object.assign(exElement || {}, updatedValues);

        modeling.updateProperties(element, {
            extensionElements,
        });
    }, [businessObject.extensionElements, element, moddle, modeling, selectedFunction]);

    useEffect(() => {
        form.resetFields();
        const extensionElements = businessObject.extensionElements;
        if (extensionElements) {
            let exElement = extensionElements.get('values').find(el => el.$instanceOf('pb:Function'));
            form.setFieldsValue(exElement);
        }
    }, [businessObject, form, elementId]);

    useEffect(() => {
        updateElementProperties();
    }, [selectedFunction, updateElementProperties])

    const selectFunction = useCallback(name => {
        setSelectedFunction(allowedFunctions.find(f => f.name === name));
    }, [allowedFunctions]);
    window.moddle = moddle;

    return (
        <Form
            form={form}
            layout='vertical'
            onValuesChange={updateElementProperties}
        >
            {allowedFunctions?.length > 1 && 
                <Form.Item
                    label="Funktion"
                >
                    <Select 
                        value={selectedFunction?.name}
                        onChange={selectFunction}
                        placeholder="Bitte auswählen..."
                    >
                        {allowedFunctions.map(({ name, meta: { formLabel } }) => (
                            <Select.Option key={name} value={name}>{formLabel}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            }

            {selectedFunction?.properties?.map(({ name, meta: { formLabel, formType } }) => (
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
