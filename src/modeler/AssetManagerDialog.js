import { Button, Col, Empty, Modal, Result, Row, Space, Tree, Typography, Upload } from 'antd';
import React, { useCallback, useContext, useMemo, useState } from 'react';

import { MediaFileUpload } from './MediaFileUpload';
import { RenameAssetDialog } from './RenameAssetDialog';
import { UploadOutlined } from '@ant-design/icons';
import { appContext } from '../base/AppContextProvider';
import styles from './AssetManagerDialog.module.css';

export function AssetManagerDialog({
    onClose,
}) {
    const { assets, setAssets } = useContext(appContext);
    const [showDialog, setShowDialog] = useState(null);
    const [selectedKeys, setSelectedKeys] = useState(['upload']);

    const selectedAsset = assets[selectedKeys[0]];

    const treeData = useMemo(() => {
        const paths = Object.keys(assets);

        const rootNode = { children: [] };
        paths.forEach(path => {
            const { name } = assets[path];

            const parts = name.split('/');
            let node = rootNode;
            for (let part of parts) {
                let nextNode = node.children.find(({ title }) => title === part);
                if (!nextNode) {
                    if (part === parts[parts.length - 1]) {
                        nextNode = {
                            // wrap in span needed for multiple elements between same title
                            // because same title nodes will be filtered by antd
                            title: <span>{part}</span>,
                            key: path,
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
                }
                node = nextNode;
            }
        });
        rootNode.children.push({
            isLeaf: true,
            icon: <UploadOutlined />,
            key: 'upload',
            title: <strong>Datei hochladen</strong>,
        })
        return rootNode.children;
    }, [assets]);

    const handleCloseDialog = useCallback(() => {
        setShowDialog(null);
    }, []);

    const handleRenameClick = useCallback(() => {
        setShowDialog('rename');
    }, []);

    const handleDeleteClick = useCallback(async () => {
        setShowDialog('delete');
    }, []);

    const handleUpload = useCallback(asset => {
        setSelectedKeys([asset.path]);
    }, []);

    const handleSelect = useCallback(selectedKeys => {
        setSelectedKeys(selectedKeys);
    }, []);

    return (
        <Modal
            centered
            visible={true}
            title="Assets verwalten"
            onCancel={onClose}
            width={800}
            footer={null}
        >
            <Row gutter={16}>
                <Col span={12}>
                    <Tree.DirectoryTree
                        defaultExpandAll
                        treeData={treeData}
                        onSelect={handleSelect}
                        selectedKeys={selectedKeys}
                    />
                </Col>
                <Col span={12}>
                    {selectedAsset ?
                        (
                            <Space direction="vertical">
                                <div className={styles.preview}>
                                    {selectedAsset.type.startsWith('image') &&
                                        <img
                                            src={selectedAsset.objectUrl}
                                            alt=""
                                        />
                                    }

                                    {selectedAsset.type.startsWith('video') &&
                                        <video
                                            src={selectedAsset.objectUrl}
                                            controls
                                        />
                                    }
                                </div>

                                <Space className={styles.buttons}>
                                    <Button
                                        onClick={handleRenameClick}
                                    >
                                        Umbenennen
                                    </Button>
                                    <Button
                                        onClick={handleDeleteClick}
                                        danger
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
                    asset={selectedAsset} 
                    onClose={handleCloseDialog}
                />
            }
        </Modal>
    );
}