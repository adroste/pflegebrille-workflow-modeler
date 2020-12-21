import { Radio, Typography } from 'antd';
import React, { useCallback, useContext } from 'react';

import { WarningOutlined } from '@ant-design/icons';
import { findParent } from '../../util';
import { modelerContext } from '../../modeler/ModelerContextProvider';
import styles from './DataInputOutputSelect.module.css';

const NO_DATA_VALUE = '__noData__';

export function DataInputSelect({
    businessObject,
    onChange,
    value,
}) {
    const { moddle } = useContext(modelerContext);

    const activity = findParent(businessObject, 'bpmn:Activity');

    const options = [
        {
            label: 'Keine Eingabe',
            value: NO_DATA_VALUE,
        }
    ];
    activity?.dataInputAssociations?.forEach(cur => {
        const { name, id } = cur.sourceRef[0];
        options.push({
            label: name || id,
            value: id,
        });
    });

    const selected = value ? value.refId : NO_DATA_VALUE;
    const isInvalid = options.every(({ value }) => value !== selected);

    const handleChange = useCallback(e => {
        const selectedValue = e.target.value;
        if (selectedValue === NO_DATA_VALUE) {
            onChange(undefined);
        } else {
            const dataInputRef = moddle.create('pb:DataInputRef', { refId: selectedValue });
            dataInputRef.$parent = businessObject;
            onChange(dataInputRef);
        }
    }, [businessObject, moddle, onChange]);

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