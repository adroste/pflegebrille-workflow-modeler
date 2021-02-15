import { Button, Col, Modal, Row, Space, Tree, Typography } from 'antd';
import { CheckOutlined, DeleteOutlined, EditOutlined, PictureOutlined, UploadOutlined, WarningOutlined } from '@ant-design/icons';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { findParent, is, traverseModdle } from '../meta-model/rules/util';
import { useAssetById, useAssets } from './useAssets';

import { IssueList } from './IssueList';
import { MediaFileUpload } from './MediaFileUpload';
import { MediaPreview } from './MediaPreview';
import { RenameAssetDialog } from './RenameAssetDialog';
import { appContext } from '../base/AppContextProvider';
import { modelerContext } from './ModelerContextProvider';
import styles from './AssetManagerDialog.module.css';
import { useIssues } from './useIssues';

const UPLOAD_KEY = 'upload';

export function AssetManagerDialog({
    onClose,
    onSelect = null,
}) {
    const { setAssetData } = useContext(appContext);
    const { bpmnjs, eventBus } = useContext(modelerContext);
    const [showDialog, setShowDialog] = useState(null);
    const [selectedKeys, setSelectedKeys] = useState([UPLOAD_KEY]);
    const issues = useIssues();

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
            parts.forEach((part, i) => {
                let nextNode = node.children.find(({ title }) => title === part);
                if (!nextNode) {
                    if (i === parts.length - 1) {
                        nextNode = {
                            // wrap in span needed for multiple elements with same title
                            // because same title nodes will be filtered by antd
                            title: <span>{part}</span>,
                            key: id,
                            isLeaf: true,
                            icon: issues?.[id] 
                                ? <WarningOutlined style={{ color: '#faad14' }} />
                                : <PictureOutlined />,
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
            });
        });

        rootNode.children.push({
            isLeaf: true,
            icon: <UploadOutlined />,
            key: UPLOAD_KEY,
            title: <strong>Datei hochladen</strong>,
        });

        return rootNode.children;
    }, [assets, issues]);

    const issueList = useMemo(() => {
        const list = [];
        assets.forEach(({ id }) => {
            if (issues?.[id])
                list.push(...issues[id]);
        });
        return list;
    }, [assets, issues]);

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
            const assets = extElements.get('values').find(element => is(element, 'pb:Assets'));
            assets.assets = assets.assets?.filter(el => el !== asset.element);

            setAssetData(data => {
                const newData = { ...data };
                delete data[asset.element.id];
                return newData;
            });

            traverseModdle(bpmnjs.getDefinitions(), node => {
                node.$descriptor.properties.forEach(p => {
                    if (node[p.name] === asset.element) {
                        node.set(p.name, undefined);

                        const changed = [node];
                        const parent = findParent(node, 'bpmn:Task');
                        if (parent)
                            changed.push(parent);
                        eventBus.fire('elements.changed', { elements: changed });
                    }
                });
            });

            eventBus.fire('elements.changed', { elements: [definitions, extElements, assets] });

            setSelectedKeys([UPLOAD_KEY]);
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
                        Alle Verweise auf diese Datei werden ungültig.
                    </p>
                </>
            ),
            okButtonProps: { danger: true },
            okText: 'Löschen',
            onOk: deleteAsset,
        });
    }, [asset, bpmnjs, eventBus, setAssetData]);

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
                    <IssueList 
                        className={styles.issueList}
                        issues={issueList} 
                    />

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