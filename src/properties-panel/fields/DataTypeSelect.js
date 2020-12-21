import { DataTypeEnum, DataTypeLabels } from '../../meta-model/enum/DataTypeEnum';
import React, { useCallback, useMemo } from 'react';

import { Select } from 'antd';

export function DataTypeSelect({
    onChange,
    value,
}) {
    const options = useMemo(() => Object.values(DataTypeEnum).map(value => ({
        label: DataTypeLabels[value],
        value,
    })), []);

    const handleChange = useCallback(selectedValue => {
        onChange(selectedValue);
    }, [onChange]);

    return (
        <Select
            placeholder="Datentyp wählen..."
            options={options}
            value={value}
            onChange={handleChange}
        />
    );
}