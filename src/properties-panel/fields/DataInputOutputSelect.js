import { Radio, Typography } from 'antd';
import React, { useCallback, useContext } from 'react';

import { WarningOutlined } from '@ant-design/icons';
import { findParent } from '../../meta-model/rules/util';
import { modelerContext } from '../../modeler/ModelerContextProvider';
import styles from './DataInputOutputSelect.module.css';

const NO_DATA_VALUE = '__noData__';

export function DataInputOutputSelect({
    isInput,
    businessObject,
    onChange,
    value,
}) {
    const { moddle } = useContext(modelerContext);

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

    const selected = value ? value.refId : NO_DATA_VALUE;
    const isInvalid = options.every(({ value }) => value !== selected);

    const handleChange = useCallback(e => {
        const selectedValue = e.target.value;
        if (selectedValue === NO_DATA_VALUE) {
            onChange(undefined);
        } else {
            let dataRef = value;
            if (!dataRef) {
                dataRef = moddle.create(isInput ? 'pb:DataInputRef' : 'pb:DataOutputRef');
                dataRef.$parent = businessObject;
            }
            dataRef.refId = selectedValue;
            onChange(dataRef);
        }
    }, [businessObject, isInput, moddle, onChange, value]);

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