import React, { useCallback, useContext } from 'react';

import { Select } from './Select';
import { modelerContext } from '../../modeler/ModelerContextProvider';

export function ExtensionSelect({
    businessObject,
    selectOptions,
    selectPlaceholder,
    onChange,
    value,
}) {
    const { moddle } = useContext(modelerContext);

    const handleChange = useCallback(selectedValue => {
        if (value?.$type === selectedValue)
            return;
        const extElement = moddle.create(selectedValue);
        extElement.$parent = businessObject;
        onChange(extElement);
    }, [businessObject, moddle, onChange, value?.$type]);

    return (
        <Select
            selectOptions={selectOptions}
            selectPlaceholder={selectPlaceholder}
            value={value?.$type}
            onChange={handleChange}
        />
    );
}