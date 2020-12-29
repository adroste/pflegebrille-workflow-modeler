import { Radio, Typography } from 'antd';

import React from 'react';
import { WarningOutlined } from '@ant-design/icons';
import { findParent } from '../../meta-model/rules/util';
import styles from './DataInputOutputSelect.module.css';

const NO_DATA_VALUE = '__noData__';

export function DataInputOutputSelect({
    isInput,
    businessObject,
    onChange,
    value,
}) {
    const activity = findParent(businessObject, 'bpmn:Activity');

    const options = [
        {
            label: isInput ? 'Keine Eingabe' : 'Keine Ausgabe',
            value: NO_DATA_VALUE,
        }
    ];

    let dataAssociations;
    if (isInput)
        dataAssociations = activity?.dataInputAssociations?.map(da => da.sourceRef[0]);
    else
        dataAssociations = activity?.dataOutputAssociations?.map(da => da.targetRef);

    dataAssociations?.forEach(({ name, id }) => {
        options.push({
            label: name || id,
            value: id,
        });
    });

    const selected = value ? value.id : NO_DATA_VALUE;
    const isInvalid = options.every(({ value }) => value !== selected);

    const handleChange = e => {
        const selectedValue = e.target.value;
        if (selectedValue === NO_DATA_VALUE) {
            onChange(undefined);
        } else {
            const element = dataAssociations.find(({ id }) => id === selectedValue);
            onChange(element);
        }
    };

    return (
        <>
            {isInvalid &&
                <div>
                    <Typography.Text type="warning">
                        <WarningOutlined /> Ungültig: {selected}
                    </Typography.Text>
                </div>
            }

            <Radio.Group
                className={styles.radioGroup}
                options={options}
                onChange={handleChange}
                value={selected}
            />
        </>
    );
}