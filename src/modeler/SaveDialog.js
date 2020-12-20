import { Alert, Button, Form, Input, Modal, Space } from 'antd';
import { CloudOutlined, CloudUploadOutlined, DesktopOutlined, DownloadOutlined, SendOutlined } from '@ant-design/icons';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { appContext } from '../base/AppContextProvider';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { modelerContext } from './ModelerContextProvider';
import styles from './SaveDialog.module.css';
import { useIssues } from './useIssues';

export function SaveDialog({
    onClose,
}) {
    const { exportWorkflow } = useContext(appContext);
    const { canvas, eventBus, getXml } = useContext(modelerContext);
    const [rootElement, setRootElement] = useState();
    const [form] = Form.useForm();

    const issues = useIssues();
    const hasIssues = Object.keys(issues).length !== 0;

    useEffect(() => {
        const rootElement = canvas.getRootElement(); 
        setRootElement(rootElement);
        const bo = getBusinessObject(rootElement);
        form.setFieldsValue({
            name: bo.name || "",
        });
    }, [canvas, form, onClose])

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
            const bo = getBusinessObject(rootElement);
            bo.set('name', values.name);
            eventBus.fire('elements.changed', { elements: [rootElement] });
        }
    }, [eventBus, rootElement]);

    if (!rootElement)
        return null;

    return (
        <Modal
            centered
            title="Workflow Speichern"
            visible={true}
            onCancel={onClose}
            footer={null}
        >
            <Space className={styles.wrapper} direction="vertical">

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

                {hasIssues &&
                    <Alert
                        type="warning"
                        description={
                            <div>
                                Der Workflow enthält unbeseitigte Fehler/Warnungen.<br />
                                Die Pflegebrille kann diesen Workflow <strong>nicht ausführen!</strong>
                            </div>
                        }
                        showIcon
                    />
                }

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
            </Space>
        </Modal>
    );
}
