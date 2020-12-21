import React, { useCallback, useContext, useMemo } from 'react';

import { Select } from 'antd';
import { is } from '../../meta-model/rules/util';
import { modelerContext } from '../../modeler/ModelerContextProvider';

export function FunctionSelect({
    businessObject,
    functionMap,
    onChange,
    value,
}) {
    const { moddle } = useContext(modelerContext);

    const options = useMemo(() => Object.keys(functionMap).map(value => ({
        label: functionMap[value],
        value,
    })), [functionMap]);

    const selected = options.find(option => value && is(value, option.value));

    const handleChange = useCallback(selectedValue => {
        if (selectedValue === selected?.value);
        const functionElement = moddle.create(selectedValue);
        functionElement.$parent = businessObject;
        onChange(functionElement);
    }, [businessObject, moddle, onChange, selected?.value]);

    return (
        <Select
            placeholder="Funktion wählen..."
            options={options}
            value={selected?.value}
            onChange={handleChange}
        />
    );
}