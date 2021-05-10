import { Modal, Spin, Tree } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { downloadWorkflowApi, getPackageListForWorkflowApi, getWorkflowListApi } from '../api';

import { CloudDownloadOutlined } from '@ant-design/icons';
import { useApi } from '../useApi';

export function LoadRegistryDialog({
    onClose,
    onLoad,
}) {
    const [file, setFile] = useState();
    const [list, setList] = useState([]);
    const [packages, setPackages] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);

    const expandedKeys = useMemo(() => selectedKeys.map(k => k.split('/')[0]), [selectedKeys]);
    const workflow = expandedKeys[0];

    const autoFetchPackages = useMemo(() => {
        if (!workflow)
            return false;
        return { reqParams: { path: { workflow } } };
    }, [workflow]);

    const [fetchListState] = useApi(getWorkflowListApi, setList, true);
    const [fetchPackagesState] = useApi(getPackageListForWorkflowApi, setPackages, autoFetchPackages);
    const [downloadState, downloadWorkflow] = useApi(downloadWorkflowApi, setFile);

    const loading = fetchListState.loading || fetchPackagesState.loading || downloadState.loading;
    const error = fetchListState.error || fetchPackagesState.error || downloadState.error;

    const okButtonProps = useMemo(() => ({
        icon: <CloudDownloadOutlined />,
        disabled: !selectedKeys || !selectedKeys.length || !selectedKeys[0].includes('/'),
        loading,
    }), [loading, selectedKeys]);

    const treeData = useMemo(() => {
        const nodes = [];
        for (let wf of list) {
            let children = null;
            if (wf === workflow) {
                children = packages?.map(file => ({
                    title: <span>{file}</span>,
                    key: `${wf}/${file}`,
                    isLeaf: true,
                }));
            }
            nodes.push({
                title: wf,
                key: wf,
                children,
            });
        }
        return nodes;
    }, [list, packages, workflow]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const remountKey = useMemo(() => Math.random(), [treeData]);

    useEffect(() => {
        if (error) {
            Modal.error({
                title: 'Fehler',
                content: 'Netzwerkfehler beim Abrufen der Workflows',
            });
            onClose();
        } else if (file) {
            onLoad({
                isZip: true,
                data: file,
            });
        }
    }, [error, file, onClose, onLoad]);

    const handleOk = useCallback(() => {
        downloadWorkflow({
            path: {
                workflow,
                filename: selectedKeys[0].split('/')[1],
            }
        });
    }, [downloadWorkflow, selectedKeys, workflow]);

    const handleCancel = useCallback(() => {
        onClose();
    }, [onClose]);

    const handleTreeSelect = useCallback((selectedKeys) => {
        setSelectedKeys(selectedKeys);
    }, []);

    return (
        <Modal
            centered
            title="Workflow laden"
            visible={true}
            onCancel={handleCancel}
            okText="Laden"
            onOk={handleOk}
            okButtonProps={okButtonProps}
            cancelText="Abbrechen"
        >
            <Spin
                spinning={loading}
                tip="Lade Workflows..."
            >
                <Tree.DirectoryTree
                    key={remountKey}
                    treeData={treeData}
                    onSelect={handleTreeSelect}
                    expandedKeys={expandedKeys}
                    loadedKeys={expandedKeys}
                    selectedKeys={selectedKeys}
                />
            </Spin>
        </Modal>
    );
}
