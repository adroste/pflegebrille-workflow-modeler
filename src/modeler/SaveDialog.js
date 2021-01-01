import { Alert, Button, Form, Input, Modal, Space } from 'antd';
import { CloudOutlined, CloudUploadOutlined, DesktopOutlined, DownloadOutlined, PictureOutlined, SendOutlined } from '@ant-design/icons';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { downloadBlob, svgUrlToPngBlob } from '../util';

import { appContext } from '../base/AppContextProvider';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { modelerContext } from './ModelerContextProvider';
import styles from './SaveDialog.module.css';
import { useIssues } from './useIssues';

export function SaveDialog({
    onClose,
}) {
    const { exportWorkflow } = useContext(appContext);
    const { canvas, eventBus, getSvg, getXml } = useContext(modelerContext);
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

    const getFileName = useCallback(() => {
        let name = form.getFieldValue('name') || 'Workflow';
        name = name.replace(/[/\\?%*:|"<>]/g, '-');
        return name;
    }, [form]);

    const handleDownload = useCallback(async () => {
        const xml = await getXml();
        const zip = await exportWorkflow(xml);
        downloadBlob(zip, `${getFileName()}.zip`);
        onClose();
    }, [exportWorkflow, getFileName, getXml, onClose]);

    const handleDownloadPng = useCallback(async () => {
        const svg = await getSvg();
        const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
        const svgUrl = URL.createObjectURL(svgBlob);
        const pngBlob = await svgUrlToPngBlob(svgUrl);
        URL.revokeObjectURL(svgUrl);
        downloadBlob(pngBlob, `${getFileName()}.png`);
        onClose();
    }, [getFileName, getSvg, onClose]);

    const handleDownloadSvg = useCallback(async () => {
        const svg = await getSvg();
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        downloadBlob(blob, `${getFileName()}.svg`);
        onClose();
    }, [getFileName, getSvg, onClose]);

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
                        className={styles.alert}
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

                    <Space>
                        <Button
                            onClick={handleDownloadPng}
                            icon={<PictureOutlined />}
                            shape="round"
                        >
                            Als Bild speichern
                        </Button>

                        <Button
                            onClick={handleDownloadSvg}
                            icon={<PictureOutlined />}
                            shape="round"
                        >
                            Als SVG speichern
                        </Button>
                    </Space>

                    <Space>
                        <Button
                            onClick={handleDownload}
                            icon={<DownloadOutlined />}
                            shape="round"
                        >
                            Workflow herunterladen
                        </Button>
                    </Space>
                </Space>
            </Space>
        </Modal>
    );
}
