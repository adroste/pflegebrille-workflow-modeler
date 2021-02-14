import { Button, Checkbox, Form, Input, Select, Space } from 'antd';
import { CheckOutlined, FileAddOutlined } from '@ant-design/icons';

import { DataTypeEnum } from 'pflegebrille-workflow-meta-model';
import { DataTypeLabels } from '../meta-model/enum/DataTypeLabels';
import React from 'react';
import { enumToSelectOptions } from '../meta-model/util';
import { makeId } from '../util';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { useMemo } from 'react';

export function EditDatumForm({
    initialValues,
    onFinish,
    extraButtons,
    submitText = 'Speichern',
}) {
    const [form] = Form.useForm();

    const options = useMemo(() =>
        enumToSelectOptions(DataTypeEnum, DataTypeLabels, [DataTypeEnum.ANY]), []);

    useEffect(() => {
        form.resetFields();
    }, [initialValues, form]);

    const handleValuesChange = useCallback(({ type }) => {
        if (type) {
            form.setFieldsValue({
                name: `${DataTypeLabels[type]} ${makeId(4, { upperCase: true })}`,
            });
        }
    }, [form]);

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={initialValues}
            onValuesChange={handleValuesChange}
            onFinish={onFinish}
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
                    </Button>
                    {extraButtons}
                </Space>
            </Form.Item>
        </Form>
    );
}