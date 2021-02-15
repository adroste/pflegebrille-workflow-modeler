import { Button, Checkbox, Form, Input, Select, Space, Tooltip, Typography } from 'antd';
import { CheckOutlined, FileAddOutlined, UndoOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

import { DataTypeEnum } from 'pflegebrille-workflow-meta-model';
import { DataTypeLabels } from '../meta-model/enum/DataTypeLabels';
import { enumToSelectOptions } from '../meta-model/util';
import { makeId } from '../util';
import styles from './EditDatumForm.module.css';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { useMemo } from 'react';

export function EditDatumForm({
    initialValues,
    onFinish,
    extraButtons,
    submitText = 'Speichern',
    successText = 'Gespeichert',
}) {
    const [form] = Form.useForm();
    const [success, setSuccess] = useState(false);

    const options = useMemo(() =>
        enumToSelectOptions(DataTypeEnum, DataTypeLabels, [DataTypeEnum.ANY]), []);

    const reset = useCallback(() => {
        form.resetFields();
        setSuccess(false);
    }, [form]);

    useEffect(() => {
        reset();
    }, [initialValues, reset]);

    const handleValuesChange = useCallback(({ type }) => {
        if (type) {
            form.setFieldsValue({
                name: `${DataTypeLabels[type]} ${makeId(4, { upperCase: true })}`,
            });
        }
    }, [form]);

    const handleFinish = useCallback(values => {
        setSuccess(true);
        onFinish?.(values);
    }, [onFinish]);

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={initialValues}
            onValuesChange={handleValuesChange}
            onFinish={handleFinish}
        >
            <Form.Item
                name="type"
                label="Datentyp"
                rules={[
                    { required: true, message: "Datentyp erforderlich" }
                ]}
            >
                <Select options={options} />
            </Form.Item>

            <Form.Item
                name="name"
                label="Name"
                rules={[
                    { required: true, message: "Name erforderlich" }
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="isCollection"
                valuePropName="checked"
            >
                <Checkbox>Kann mehrere Elemente speichern ( <FileAddOutlined /> )</Checkbox>
            </Form.Item>

            <Form.Item>
                <Space>
                    <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        htmlType="submit"
                    >
                        {submitText}
                        {success &&
                            <Typography.Text type="success" className={styles.successText}>
                                {successText}
                            </Typography.Text>
                        }
                    </Button>
                    <Tooltip title="Zurücksetzen">
                        <Button
                            type="default"
                            icon={<UndoOutlined />}
                            onClick={reset}
                        />
                    </Tooltip>
                    {extraButtons}
                </Space>
            </Form.Item>
        </Form>
    );
}