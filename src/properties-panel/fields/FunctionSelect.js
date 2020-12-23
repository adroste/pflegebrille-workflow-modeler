import React, { useCallback, useContext } from 'react';

import { Select } from 'antd';
import { modelerContext } from '../../modeler/ModelerContextProvider';

export function FunctionSelect({
    businessObject,
    functionOptions,
    onChange,
    value,
}) {
    const { moddle } = useContext(modelerContext);

    const handleChange = useCallback(selectedValue => {
        if (value?.$type === selectedValue)
            return;
        const functionElement = moddle.create(selectedValue);
        functionElement.$parent = businessObject;
        onChange(functionElement);
    }, [businessObject, moddle, onChange, value?.$type]);

    return (
        <Select
            placeholder="Funktion wählen..."
            value={value?.$type}
            onChange={handleChange}
            listHeight={500}
        >
            {functionOptions.map(({ type, label, group, options }) => (
                options ?
                    (
                        <Select.OptGroup key={group} label={group}>
                            {options.map(({ type, label }) => (
                                <Select.Option key={label} value={type}>{label}</Select.Option>
                            ))}
                        </Select.OptGroup>
                    ) : (
                        <Select.Option key={label} value={type}>{label}</Select.Option>
                    )
            ))}
        </Select>
    );
}