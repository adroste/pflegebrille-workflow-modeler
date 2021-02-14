import { Checkbox, Form, Input, Typography } from 'antd';
import { ExportOutlined, ImportOutlined } from '@ant-design/icons';

import { CardinalityLabels } from '../meta-model/enum/CardinalityLabels';
import { DataModeEnum } from 'pflegebrille-workflow-meta-model';
import { DataTypeLabels } from '../meta-model/enum/DataTypeLabels';
import { DatumSelect } from './fields/DatumSelect';
import { ExtensionSelect } from './fields/ExtensionSelect';
import { FormTypeEnum } from '../meta-model/enum/FormTypeEnum';
import { MediaFileInput } from './fields/MediaFileInput';
import React from 'react';
import { Select } from './fields/Select';
import styles from './FormField.module.css';

export function FormField({
    binding: {
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

        case FormTypeEnum.DATUM_SELECT: {
            const propertyDescriptor = businessObject.$descriptor.properties.find(({ name }) => name === property);
            const { dataType, dataCardinality, dataOptional, dataMode } = propertyDescriptor.meta;
            return (
                <Form.Item
                    name={property}
                    label={
                        <span>
                            {label}
                            <Typography.Text type="secondary" className={styles.dataInputOutputSubTitle}>
                                {dataMode === DataModeEnum.INPUT ?
                                    (
                                        <span><ImportOutlined className={styles.dataInputIcon} /> Dateneingabe {dataOptional && '(optional)'}</span>
                                    ) : (
                                        <span><ExportOutlined className={styles.dataOutputIcon} /> Datenausgabe {dataOptional && '(optional)'}</span>
                                    )
                                }
                                <span>Typ: {DataTypeLabels[dataType] || dataType}</span>
                                <span>Kardinalität: {CardinalityLabels[dataCardinality] || dataCardinality}</span>
                            </Typography.Text>
                        </span>
                    }
                >
                    <DatumSelect
                        dataMode={dataMode}
                        dataType={dataType}
                        dataCardinality={dataCardinality}
                        dataOptional={dataOptional}
                        defaultName={label}
                    />
                </Form.Item>
            );
        }

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