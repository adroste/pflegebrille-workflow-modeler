import { Button, Col, Modal, Row, Space, Tree, Typography } from 'antd';
import { CheckOutlined, DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { useAssetById, useAssets } from './useAssets';

import { MediaFileUpload } from './MediaFileUpload';
import { MediaPreview } from './MediaPreview';
import { RenameAssetDialog } from './RenameAssetDialog';
import { modelerContext } from './ModelerContextProvider';
import styles from './AssetManagerDialog.module.css';

export function AssetManagerDialog({
    onClose,
    onSelect = null,
}) {
    const { bpmnjs, eventBus } = useContext(modelerContext);
    const [showDialog, setShowDialog] = useState(null);
    const [selectedKeys, setSelectedKeys] = useState(['upload']);

    const assets = useAssets();
    const asset = useAssetById(selectedKeys[0]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const remountKey = useMemo(() => Math.random(), [assets]);

    const treeData = useMemo(() => {
        let uid = 0;
        const rootNode = { children: [] };
        assets.forEach(({ id, name }) => {
            const parts = name.split('/');
            let node = rootNode;
            for (let part of parts) {
                let nextNode = node.children.find(({ title }) => title === part);
                if (!nextNode) {
                    if (part === parts[parts.length - 1]) {
                        nextNode = {
                            // wrap in span needed for multiple elements with same title
                            // because same title nodes will be filtered by antd
                            title: <span>{part}</span>,
                            key: id,
                            isLeaf: true,
                        };
                    } else {
                        nextNode = {
                            title: part,
                            key: ++uid,
                            selectable: false,
                            children: [],
                        };
                    }
                    node.children.push(nextNode);
                }
                node = nextNode;
            }
        });

        rootNode.children.push({
            isLeaf: true,
            icon: <UploadOutlined />,
            key: 'upload',
            title: <strong>Datei hochladen</strong>,
        });

        return rootNode.children;
    }, [assets]);

    const handleCloseDialog = useCallback(() => {
        setShowDialog(null);
    }, []);

    const handleRenameClick = useCallback(() => {
        setShowDialog('rename');
    }, []);

    const handleDeleteClick = useCallback(async () => {
        const deleteAsset = () => {
            const definitions = bpmnjs.getDefinitions();
            const extElements = definitions.extensionElements;
            extElements.values = extElements.values.filter(el => el !== asset.element);

            eventBus.fire('elements.changed', { elements: [definitions, extElements] })
        };

        Modal.confirm({
            centered: true,
            title: 'Wirklich löschen?',
            content: (
                <>
                    <p>
                        Die Datei "{asset.element.name}" wird unwiderruflich gelöscht.
                    </p>
                    <p>
                        Alle Elemente, die auf diese Datei verweisen, müssen geändert werden.
                    </p>
                </>
            ),
            okButtonProps: { danger: true },
            okText: 'Löschen',
            onOk: deleteAsset,
        });
    }, [asset, bpmnjs, eventBus]);

    const handleUpload = useCallback(({ element }) => {
        setSelectedKeys([element.id]);
    }, []);

    const handleSelect = useCallback(() => {
        onSelect(asset)
    }, [asset, onSelect]);

    const handleTreeSelect = useCallback(selectedKeys => {
        setSelectedKeys(selectedKeys);
    }, []);

    return (
        <Modal
            centered
            visible={true}
            title="Assets verwalten"
            onCancel={onClose}
            width={800}
            footer={onSelect &&
                <>
                    <Button onClick={onClose}>
                        Abbrechen
                    </Button>
                    <Button
                        icon={<CheckOutlined />}
                        type="primary"
                        disabled={!asset.element}
                        onClick={handleSelect}
                    >
                        Auswählen
                    </Button>
                </>
            }
        >
            <Row gutter={16}>
                <Col span={12}>
                    <Tree.DirectoryTree
                        className={styles.tree}
                        key={remountKey}
                        defaultExpandAll
                        treeData={treeData}
                        onSelect={handleTreeSelect}
                        selectedKeys={selectedKeys}
                    />
                </Col>
                <Col span={12}>
                    {asset.element ?
                        (
                            <Space direction="vertical" className={styles.preview}>
                                <MediaPreview id={asset.element.id} />

                                <Space className={styles.buttons}>
                                    <Button
                                        onClick={handleRenameClick}
                                        icon={<EditOutlined />}
                                    >
                                        Umbenennen
                                    </Button>
                                    <Button
                                        onClick={handleDeleteClick}
                                        danger
                                        icon={<DeleteOutlined />}
                                    >
                                        Löschen
                                    </Button>
                                </Space>

                                <Typography.Text type="secondary" className={styles.hint}>
                                    Tipp: Man kann Ordner über <i>Umbenennen</i> anlegen
                                </Typography.Text>
                            </Space>
                        ) : (
                            <MediaFileUpload
                                onUpload={handleUpload}
                            />
                        )
                    }
                </Col>
            </Row>

            {showDialog === 'rename' &&
                <RenameAssetDialog
                    asset={asset}
                    onClose={handleCloseDialog}
                />
            }
        </Modal>
    );
}