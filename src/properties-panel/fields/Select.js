import { Select as AntSelect } from 'antd';
import React from 'react';

export function Select({
    selectOptions,
    selectPlaceholder,
    onChange,
    value,
}) {
    return (
        <AntSelect
            placeholder={selectPlaceholder}
            value={value}
            onChange={onChange}
            listHeight={500}
        >
            {selectOptions.map(({ value, label, group, options }) => (
                options ?
                    (
                        <AntSelect.OptGroup key={group} label={group}>
                            {options.map(({ value, label }) => (
                                <AntSelect.Option key={label} value={value}>{label}</AntSelect.Option>
                            ))}
                        </AntSelect.OptGroup>
                    ) : (
                        <AntSelect.Option key={label} value={value}>{label}</AntSelect.Option>
                    )
            ))}
        </AntSelect>
    );
}