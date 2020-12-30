import { Divider, Modal, Radio, Typography } from 'antd';
import React, { useCallback, useState } from 'react';

import { CheckOutlined } from '@ant-design/icons';
import styles from './CreateNewDialog.module.css';
import { templates } from '../templates/templates';

export function CreateNewDialog({
    onClose,
    onLoad,
}) {
    const [template, setTemplate] = useState(0);

    const handleOk = useCallback(() => {
        const src = templates[template].src;

        fetch(src)
            .then(res => res.text())
            .then(xml => {
                onLoad({
                    isZip: false,
                    data: xml,
                });
            })
            .catch(err => {
                console.error(err);
                Modal.error({
                    title: 'Fehler',
                    content: 'Die Workflow-Vorlage konnte nicht geladen werden.'
                });
            });
    }, [onLoad, template]);

    const handleChange = useCallback(e => {
        setTemplate(e.target.value);
    }, []);

    return (
        <Modal
            className={styles.radioGroup}
            centered
            title="Neuer Workflow"
            visible={true}
            onCancel={onClose}
            okText="Workflow erstellen"
            onOk={handleOk}
            cancelText="Abbrechen"
        >
            <Radio.Group
                className={styles.radioGroup}
                onChange={handleChange}
                value={template}
                size="large"
            >
                {templates.map(({ label, separator }, i) => (
                    separator ?
                        (
                            <Divider key={label} orientation="left">{label}</Divider>
                        ) : (
                            <Radio.Button key={label} className={styles.radio} value={i} >
                                { template === i && <CheckOutlined />} {label}
                            </Radio.Button>
                        )
                ))}
            </Radio.Group>
            
            <Typography.Paragraph type="secondary">
                <i>* Beispiele müssen nicht medizinisch korrekt oder vollständig sein</i>
            </Typography.Paragraph>
        </Modal >
    );
}
