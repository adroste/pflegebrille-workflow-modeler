import { Checkbox, Form, Input, Typography } from 'antd';
import { ExportOutlined, ImportOutlined } from '@ant-design/icons';

import { CardinalityLabels } from '../meta-model/enum/CardinalityEnum';
import { DataInputOutputSelect } from './fields/DataInputOutputSelect';
import { DataTypeLabels } from '../meta-model/enum/DataTypeLabels';
import { ExtensionSelect } from './fields/ExtensionSelect';
import { FormTypeEnum } from '../meta-model/enum/FormTypeEnum';
import { MediaFileInput } from './fields/MediaFileInput';
import React from 'react';
import { Select } from './fields/Select';
import styles from './FormField.module.css';

export function FormField({
    binding: {
        dataCardinality,
        dataType,
        label,
        property,
        selectOptions,
        selectPlaceholder,
        type,
    },
    businessObject,
}) {
    switch (type) {

        case FormTypeEnum.CHECKBOX:
            return (
                <Form.Item
                    name={property}
                    valuePropName="checked"
                >
                    <Checkbox>{label}</Checkbox>
                </Form.Item>
            );

        case FormTypeEnum.SELECT:
            return (
                <Form.Item
                    name={property}
                    label={label}
                >
                    <Select
                        selectOptions={selectOptions}
                        selectPlaceholder={selectPlaceholder}
                    />
                </Form.Item>
            );

        case FormTypeEnum.EXTENSION_SELECT:
            return (
                <Form.Item
                    name={property}
                    label={label}
                >
                    <ExtensionSelect
                        businessObject={businessObject}
                        selectOptions={selectOptions}
                        selectPlaceholder={selectPlaceholder}
                    />
                </Form.Item>
            );

        case FormTypeEnum.MEDIA_FILE:
            return (
                <Form.Item
                    name={property}
                    label={label}
                >
                    <MediaFileInput />
                </Form.Item>
            );

        case FormTypeEnum.DATA_INPUT_SELECT:
        case FormTypeEnum.DATA_OUTPUT_SELECT:
            return (
                <Form.Item
                    name={property}
                    label={
                        <span>
                            {label}
                            <Typography.Text type="secondary" className={styles.dataInputOutputSubTitle}>
                                {type === FormTypeEnum.DATA_INPUT_SELECT ?
                                    (
                                        <span><ImportOutlined className={styles.dataInputIcon} /> Dateneingabe</span>
                                    ) : (
                                        <span><ExportOutlined className={styles.dataOutputIcon} /> Datenausgabe</span>
                                    )
                                }
                                <span>Typ: {DataTypeLabels[dataType] || dataType}</span>
                                <span>Kardinalität: {CardinalityLabels[dataCardinality] || dataCardinality}</span>
                            </Typography.Text>
                        </span>
                    }
                >
                    <DataInputOutputSelect
                        isInput={type === FormTypeEnum.DATA_INPUT_SELECT}
                        businessObject={businessObject}
                    />
                </Form.Item>
            );

        case FormTypeEnum.TEXT:
            return (
                <Form.Item
                    name={property}
                    label={label}
                >
                    <Input />
                </Form.Item>
            );

        case FormTypeEnum.MULTILINE_TEXT:
            return (
                <Form.Item
                    name={property}
                    label={label}
                >
                    <Input.TextArea autoSize={{ minRows: 3 }} showCount />
                </Form.Item>
            );

        default:
            return null;
    }
}