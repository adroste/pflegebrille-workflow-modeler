import { Button, Form, Input, Modal, Space } from 'antd';
import { CloudOutlined, CloudUploadOutlined, DesktopOutlined, DownloadOutlined, SendOutlined } from '@ant-design/icons';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { appContext } from '../base/AppContextProvider';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { is } from '../meta-model/rules/util';
import { modelerContext } from './ModelerContextProvider';
import styles from './SaveDialog.module.css';

export function SaveDialog({
    onClose,
}) {
    const { exportWorkflow } = useContext(appContext);
    const { elementRegistry, eventBus, getXml } = useContext(modelerContext);
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

    const handleDownload = useCallback(async () => {
        const xml = await getXml();
        const zip = await exportWorkflow(xml);
        const objectUrl = URL.createObjectURL(zip);

        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = 'Workflow.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        onClose();

        setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
    }, [exportWorkflow, getXml, onClose]);

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

            <Space 
                className={styles.buttons} 
                direction="vertical" 
                align="center"
            >
                <div className={styles.group}>
                    <CloudOutlined />&nbsp;&nbsp;Online
                </div>

                <Space>
                    <Button
                        onClick={() => alert('Cloud Speicher nicht verfügbar.')}
                        icon={<CloudUploadOutlined />}
                        shape="round"
                        type="primary"
                        disabled
                    >
                        In Cloud Speichern
                    </Button>

                    <Button
                        onClick={() => alert('Cloud Speicher nicht verfügbar.')}
                        icon={<SendOutlined />}
                        shape="round"
                        disabled
                    >
                        Veröffentlichen
                    </Button>
                </Space>

                <div></div>

                <div className={styles.group}>
                    <DesktopOutlined />&nbsp;&nbsp;Lokal
                </div>

                <Button
                    onClick={handleDownload}
                    icon={<DownloadOutlined />}
                    shape="round"
                >
                    Workflow herunterladen
                </Button>
            </Space>
        </Modal>
    );
}
