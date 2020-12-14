import { Button, Form, Input, Modal, Space } from 'antd';
import { CloudUploadOutlined, DownloadOutlined, SendOutlined } from '@ant-design/icons';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { is } from '../meta-model/rules/util';
import { modelerContext } from './ModelerContextProvider';

export function SaveDialog({
    onClose,
}) {
    const { elementRegistry, eventBus, saveModelerStateToXml } = useContext(modelerContext);
    const [processElement, setProcessElement] = useState();
    const [form] = Form.useForm();

    useEffect(() => {
        const processElement = elementRegistry.find(el => is(getBusinessObject(el), 'bpmn:Process'));
        setProcessElement(processElement);

        if (!processElement) {
            Modal.error({
                title: 'Fehler',
                content: 'bpmn:Process ist kein unreferenziertes Root Element. Workflow kann nicht gespeichert werden.',
                onOk() {
                    onClose();
                }
            });
            return;
        }

        const bo = getBusinessObject(processElement);
        form.setFieldsValue({
            name: bo.name,
        });
    }, [elementRegistry, form, onClose])

    const handleXmlDownload = useCallback(() => {
        saveModelerStateToXml().then(xml => {
            if (!xml)
                return;
            const link = document.createElement('a');

            let encodedData = encodeURIComponent(xml);
            link.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData;
            link.download = 'Workflow.bpmn';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            onClose();
        });
    }, [onClose, saveModelerStateToXml]);

    const handleValuesChange = useCallback(values => {
        if (values.hasOwnProperty('name')) {
                const bo = getBusinessObject(processElement);
                bo.set('name', values.name);
                eventBus.fire('elements.changed', { elements: [processElement] });
        }
    }, [eventBus, processElement]);

    if (!processElement)
        return null;

    return (
        <Modal
            centered
            title="Workflow Speichern"
            visible={true}
            onCancel={onClose}
            footer={null}
        >
            <Form
                form={form}
                layout='vertical'
                onValuesChange={handleValuesChange}
            >
                <Form.Item
                    name="name"
                    label="Name des Workflows"
                    rules={[
                        { required: true, message: "Name erforderlich" }
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>

            <Space>
                <Button
                    onClick={() => alert('Cloud Speicher nicht verfügbar.')}
                    icon={<CloudUploadOutlined />}
                    shape="round"
                    type="primary"
                >
                    Speichern
                </Button>

                <Button
                    onClick={() => alert('Cloud Speicher nicht verfügbar.')}
                    icon={<SendOutlined />}
                    shape="round"
                >
                    Veröffentlichen
                </Button>

                <Button
                    onClick={handleXmlDownload}
                    icon={<DownloadOutlined />}
                    shape="round"
                >
                    XML Herunterladen
                </Button>
            </Space>
        </Modal>
    );
}
