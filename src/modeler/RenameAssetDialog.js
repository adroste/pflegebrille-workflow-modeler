import { Form, Input, Modal, Space, Tree, Typography } from 'antd';
import React, { useCallback, useContext, useMemo, useState } from 'react';

import { modelerContext } from './ModelerContextProvider';
import styles from './RenameAssetDialog.module.css';

export function RenameAssetDialog({
    asset,
    onClose,
}) {
    const [form] = Form.useForm();
    const { eventBus } = useContext(modelerContext);
    const [name, setName] = useState(asset.name);

    const initialValues = useMemo(() => ({ name: asset.name }), [asset]);

    const treeData = useMemo(() => {
        const parts = name.split('/');
        const rootNode = { children: [] };
        let node = rootNode;
        for (let part of parts) {
            let nextNode;
            if (part === parts[parts.length - 1]) {
                nextNode = {
                    title: part,
                    key: part,
                    
                    isLeaf: true,
                };
            } else {
                nextNode = {
                    title: part,
                    key: part,
                    selectable: false,
                    children: [],
                };
            }
            node.children.push(nextNode);
            node = nextNode;
        }
        return rootNode.children;
    }, [name]);

    const handleRename = useCallback(() => {
        asset.name = name;
        eventBus.fire('elements.changed', { elements: { asset } });
        onClose();
    }, [asset, eventBus, name, onClose]);

    const handleValuesChange = useCallback(({ name }) => {
        setName(name);
    }, []);

    return (
        <Modal
            centered
            visible={true}
            title="Datei umbenennen"
            onCancel={onClose}
            onOk={handleRename}
            okText="Umbenennen"
            cancelText="Abbrechen"
        >
            <Space 
                className={styles.wrapper}
                direction="vertical" 
                size="large"
            >
                <Tree.DirectoryTree
                    key={name}
                    disabled
                    defaultExpandAll
                    treeData={treeData}
                />

                <Form
                    form={form}
                    layout="vertical"
                    initialValues={initialValues}
                    onValuesChange={handleValuesChange}
                >
                    <Form.Item
                        name="name"
                        label="Neuer Name"
                    >
                        <Input />
                    </Form.Item>

                    <Typography.Text type="secondary">
                        Man kann Ordner mittels "/" im Namen anlegen. <br />
                        Beispiel: <i>"Ordner 1/Ordner 2/meineDatei.jpg"</i>
                    </Typography.Text>
                </Form>
            </Space>
        </Modal>
    );
}