import React, { useCallback, useContext, useMemo } from 'react';
import { getInnerElements, getModelBindingsForElement } from '../util';

import { Form } from 'antd';
import { FormField } from './FormField';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { modelerContext } from '../modeler/ModelerContextProvider';
import styles from './ElementProperties.module.css';
import { useEffect } from 'react';

export function ElementProperties({
    baseElement,
    element,
}) {
    const { eventBus } = useContext(modelerContext);
    const [form] = Form.useForm();

    const businessObject = getBusinessObject(element);
    const innerElements = getInnerElements(businessObject);
    const bindings = useMemo(() => getModelBindingsForElement(businessObject), [businessObject]);

    useEffect(() => {
        const getValues = () => bindings.reduce((initialValues, cur) => {
            cur.fields?.forEach(binding => {
                initialValues[binding.property] = businessObject.get(binding.property);
            });
            return initialValues;
        }, {});
        form.setFieldsValue(getValues());

        const handleChange = ({ elements }) => {
            if (elements.some(elem => elem === element)) {
                form.setFieldsValue(getValues());
            }
        };
        eventBus.on('elements.changed', handleChange);
        return () => eventBus.off('elements.changed', handleChange);
    }, [bindings, businessObject, element, eventBus, form]);

    const updateBusinessObjectProperties = useCallback(updatedValues => {
        if (typeof businessObject.set !== 'function') {
            console.log('businessObject is no ModdleElement', businessObject);
            return;
        }

        Object.keys(updatedValues).forEach(key => {
            // value = undefined removes the key
            businessObject.set(key, updatedValues[key]);
        });

        eventBus.fire('elements.changed', { elements: [baseElement, element] });
    }, [baseElement, businessObject, element, eventBus]);

    return (
        <>
            <Form
                className={styles.form}
                form={form}
                layout='vertical'
                // initialValues={initialValues}
                onValuesChange={updateBusinessObjectProperties}
            >
                {bindings.map((binding, i) => binding.fields?.map((binding, j) => (
                    <FormField
                        key={`${binding.property}_${i}_${j}`}
                        binding={binding}
                        businessObject={businessObject}
                    />
                )))}
            </Form>

            {innerElements?.map((element, i) => (element?.$type || null) && (
                <ElementProperties
                    key={element.id || `${element.$type}_${i}`}
                    baseElement={baseElement}
                    element={element}
                />
            ))}
        </>
    );
}
