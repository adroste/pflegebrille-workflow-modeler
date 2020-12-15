import { FileOutlined, UploadOutlined } from '@ant-design/icons';
import { Modal, Result, Upload } from 'antd';
import React, { useCallback, useMemo, useRef, useState } from 'react';

import styles from './CreateNewDialog.module.css';

export function ImportDialog({
    onClose,
    onLoad,
}) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileList = useMemo(() => file ? [file] : [], [file]);
    const fileReaderRef = useRef();

    const okButtonProps = useMemo(() => ({
        disabled: !file,
        loading,
    }), [file, loading]);

    const handleOk = useCallback(() => {
        setLoading(true);

        const isZip = file.name.toLowerCase().endsWith('.zip');

        const fr = new FileReader();
        fr.onload = (e) => {
            setLoading(false);
            onLoad({
                isZip,
                data: e.target.result,
            });
        }
        fr.onerror = () => { setLoading(false); }
        if (isZip)
            fr.readAsArrayBuffer(file);
        else
            fr.readAsText(file);
    }, [file, onLoad]);

    const handleCancel = useCallback(() => {
        if (fileReaderRef.current)
            fileReaderRef.current.abort();
        onClose();
    }, [onClose]);

    const handleFileSelect = useCallback(file => {
        if (!file.name.toLowerCase().match(/(.bpmn|.xml|.zip)$/)) {
            Modal.error({
                title: 'Falscher Dateityp',
                content: 'Der Dateityp wird nicht unterstützt.'
            });
            setFile(null);
        } else {
            setFile(file);
        }
        return false; // needed to prevent auto-upload to action url
    }, []);

    return (
        <Modal
            className={styles.radioGroup}
            centered
            title="Workflow importieren"
            visible={true}
            onCancel={handleCancel}
            okText="Importieren"
            onOk={handleOk}
            okButtonProps={okButtonProps}
            cancelText="Abbrechen"
        >
            <Upload.Dragger
                accept="application/zip,application/xml,.bpmn"
                beforeUpload={handleFileSelect}
                fileList={fileList}
                showUploadList={false}
            >
                {file ?
                    (
                        <Result
                            icon={<FileOutlined />}
                            title={file.name}
                            subTitle="Klicken oder Datei hereinziehen, um eine andere Datei zu wählen."
                        />
                    ) : (
                        <Result
                            icon={<UploadOutlined />}
                            title=".zip, .xml, .bpmn"
                            subTitle="Klicken oder Datei hereinziehen, um den Import zu starten."
                        />
                    )}
            </Upload.Dragger>
        </Modal>
    );
}
