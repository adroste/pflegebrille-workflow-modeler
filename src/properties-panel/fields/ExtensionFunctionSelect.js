import React, { useCallback, useContext, useMemo } from 'react';

import { Select } from 'antd';
import { getAllowedFunctionsForType } from '../../meta-model/util';
import { modelerContext } from '../../base/ModelerContextProvider';

export function ExtensionFunctionSelect({
    businessObject,
    onChange,
    value,
}) {
    const { moddle } = useContext(modelerContext);

    const options = useMemo(() => (
        getAllowedFunctionsForType(businessObject.$type)
    ), [businessObject.$type]);

    const selected = options.find(option => value?.values?.some(exEl => exEl.$type === option.value));

    const handleChange = useCallback(selectedValue => {
        let extensionElements = value 
        if (!extensionElements) {
            extensionElements = moddle.create('bpmn:ExtensionElements');
            extensionElements.$parent = businessObject;
        }

        let functionElement = extensionElements.get('values').find(el => el.$instanceOf('pb:Function'));
        if (!functionElement && selectedValue) {
            functionElement = moddle.create(selectedValue);
            functionElement.$parent = extensionElements;
            extensionElements.get('values').push(functionElement);
        }

        onChange(extensionElements);
    }, [businessObject, moddle, onChange, value]);

    return (
        <Select
            options={options}
            value={selected?.value}
            onChange={handleChange}
        />
    );
}