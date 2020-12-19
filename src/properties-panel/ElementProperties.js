import React, { useCallback, useContext, useMemo } from 'react';

import { Form } from 'antd';
import { FormField } from './FormField';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { getModelerBindingsForType } from '../meta-model/util';
import { modelerContext } from '../modeler/ModelerContextProvider';
import styles from './ElementProperties.module.css';

export function ElementProperties({
    baseElement,
    element,
}) {
    const { eventBus } = useContext(modelerContext);
    const [form] = Form.useForm();

    const businessObject = getBusinessObject(element);

    // useEffect(() => {
    //     form.resetFields();
    // }, [businessObject, form]);

    const innerElements = []
        .concat(businessObject.extensionElements?.values)
        .concat(businessObject.dataObjectRef);

    const bindings = getModelerBindingsForType(businessObject.$type);

    const initialValues = useMemo(() => (
        bindings.reduce((initialValues, cur) => {
            cur.fields.forEach(binding => {
                initialValues[binding.property] = businessObject.get(binding.property);
            });
            return initialValues;
        }, {})
    ), [bindings, businessObject]);

    const updateBusinessObjectProperties = useCallback(updatedValues => {
        if (typeof businessObject.set !== 'function') {
            console.log('businessObject is no ModdleElement', businessObject);
            return;
        }

        Object.keys(updatedValues).forEach(key => {
            businessObject.set(key, updatedValues[key]);
        });

        eventBus.fire('elements.changed', { elements: [baseElement] });
    }, [baseElement, businessObject, eventBus]);

    return (
        <>
            <Form
                className={styles.form}
                form={form}
                layout='vertical'
                initialValues={initialValues}
                onValuesChange={updateBusinessObjectProperties}
            >
                {/* input/output fields here */}

                {bindings.map((binding, i) => binding.fields.map((binding, j) => (
                    <FormField
                        key={`${binding.property}_${i}_${j}`}
                        binding={binding}
                        businessObject={businessObject}
                    />
                )))}
            </Form>

            {innerElements.map((element, i) => (element?.$type || null) && (
                <ElementProperties
                    key={element.id || `${element.$type}_${i}`}
                    baseElement={baseElement}
                    element={element}
                />
            ))}
        </>
    );
}
