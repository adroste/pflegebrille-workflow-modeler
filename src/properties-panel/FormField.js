import { Checkbox, Form, Input, Typography } from 'antd';
import { ExportOutlined, ImportOutlined } from '@ant-design/icons';

import { CardinalityLabels } from '../meta-model/enum/CardinalityEnum';
import { DataInputOutputSelect } from './fields/DataInputOutputSelect';
import { DataTypeLabels } from '../meta-model/enum/DataTypeEnum';
import { DataTypeSelect } from './fields/DataTypeSelect';
import { FormTypeEnum } from '../meta-model/enum/FormTypeEnum';
import { FunctionSelect } from './fields/FunctionSelect';
import { MediaFileInput } from './fields/MediaFileInput';
import React from 'react';
import styles from './FormField.module.css';

export function FormField({
    businessObject,
    binding: {
        property,
        type,
        label,
        functionOptions,
        dataCardinality,
        dataType,
    },
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


        case FormTypeEnum.FUNCTION_SELECT:
            return (
                <Form.Item
                    name={property}
                    label={label}
                >
                    <FunctionSelect
                        businessObject={businessObject}
                        functionOptions={functionOptions}
                    />
                </Form.Item>
            );

        case FormTypeEnum.MEDIA_FILE:
            return (
                <Form.Item
                    name={property}
                    label={label}
                >
                    <MediaFileInput
                        businessObject={businessObject}
                    />
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
                                <span>Typ: {DataTypeLabels[dataType]}</span>
                                <span>Kardinalität: {CardinalityLabels[dataCardinality]}</span>
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

        case FormTypeEnum.DATA_TYPE_SELECT:
            return (
                <Form.Item
                    name={property}
                    label={label}
                >
                    <DataTypeSelect />
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