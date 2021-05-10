import { CloudUploadOutlined, FileOutlined } from '@ant-design/icons';
import { Collapse, Form, Input, List, Modal, Radio, Select, Space, Spin, Typography } from 'antd';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getPackageListForWorkflowApi, getWorkflowListApi, uploadWorkflowApi } from '../api';

import { appContext } from '../base/AppContextProvider';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { modelerContext } from './ModelerContextProvider';
import styles from './UploadRegistryDialog.module.css';
import { useApi } from '../useApi';

const semver = require('semver');

export function UploadRegistryDialog({
    onClose,
}) {
    const { exportWorkflow } = useContext(appContext);
    const { canvas, getXml } = useContext(modelerContext);
    const [list, setList] = useState([]);
    const [packages, setPackages] = useState([]);
    const [version, setVersion] = useState();
    const [selectedWorkflow, setSelectedWorkflow] = useState();
    const [loginForm] = Form.useForm();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const workflow = selectedWorkflow;

    const autoFetchPackages = useMemo(() => {
        if (!workflow || !list.includes(workflow))
            return false;
        return { reqParams: { path: { workflow } } };
    }, [list, workflow]);

    const [fetchListState] = useApi(getWorkflowListApi, setList, true);
    const [fetchPackagesState] = useApi(getPackageListForWorkflowApi, setPackages, autoFetchPackages);
    const [uploadState, uploadWorkflow] = useApi(uploadWorkflowApi);

    const loading = fetchListState.loading || fetchPackagesState.loading || uploadState.loading;
    const error = fetchListState.error || fetchPackagesState.error || uploadState.error;

    const okButtonProps = useMemo(() => ({
        icon: <CloudUploadOutlined />,
        disabled: !workflow || !version || !username || !password,
        loading,
    }), [loading, password, username, version, workflow]);

    const workflowName = useMemo(() => {
        const rootElement = canvas.getRootElement();
        const bo = getBusinessObject(rootElement);
        return bo.name?.trim() || '';
    }, [canvas]);

    const selectOptions = useMemo(() => {
        const options = list.map(wf => ({
            label: wf,
            value: wf,
        }));
        if (!list.includes(workflowName)) {
            options.unshift({
                label: <strong>Neuer Workflow: {workflowName}</strong>,
                value: workflowName,
            });
        }
        return options;
    }, [list, workflowName]);

    const lastVersion = useMemo(() => {
        const lastZip = packages[0];
        const lastVersion = lastZip?.replace('.zip', '');
        if (lastVersion && semver.valid(lastVersion))
            return lastVersion;
        return '0.0.0';
    }, [packages]);

    const { nextMajor, nextMinor, nextPatch } = useMemo(() => ({
        nextMajor: semver.inc(lastVersion, 'major'),
        nextMinor: semver.inc(lastVersion, 'minor'),
        nextPatch: semver.inc(lastVersion, 'patch'),
    }), [lastVersion]);

    useEffect(() => {
        if (loading)
            return;
        if (fetchListState.error || fetchPackagesState.error) {
            Modal.error({
                title: 'Fehler',
                content: 'Netzwerkfehler beim Abrufen von Daten aus der Workflow Registry.',
            });
            onClose();
        } else if (uploadState.error && uploadState.status) {
            Modal.error({
                title: 'Fehler',
                content: (uploadState.status === 401 || uploadState.status === 403)
                    ? 'Nutzername oder Passwort sind falsch.'
                    : 'Netzwerkfehler beim Hochladen des Workflows zu der Workflow Registry.',
            });
        }
    }, [error, fetchListState.error, fetchPackagesState.error, loading, onClose, uploadState.error, uploadState.status]);

    useEffect(() => {
        if (list.includes(workflowName))
            setSelectedWorkflow(workflowName);
    }, [list, workflowName]);

    const handleOk = useCallback(async () => {
        const xml = await getXml();
        const zip = await exportWorkflow(xml);
        uploadWorkflow({
            path: {
                workflow,
                version,
            },
            basicAuth: {
                username,
                password,
            }
        }, zip, () => {
            Modal.success({
                title: "Hochladen erfolgreich",
                content: `Der Workflow "${workflow}" als Version "${version}" wurde erfolgreich auf die Workflow Registry hochgeladen und steht ab jetzt zur Verfügung.`
            });
            onClose();
        });
    }, [exportWorkflow, getXml, onClose, password, uploadWorkflow, username, version, workflow]);

    const handleCancel = useCallback(() => {
        onClose();
    }, [onClose]);

    const handleWorkflowSelected = useCallback(wf => {
        setSelectedWorkflow(wf);
    }, []);

    const handleVersionChanged = useCallback(e => {
        setVersion(e.target.value);
    }, []);

    const handleLoginValuesChanged = useCallback(({ username, password }) => {
        if (username !== undefined)
            setUsername(username);
        if (password !== undefined)
            setPassword(password);
    }, []);

    return (
        <Modal
            centered
            title="Workflow hochladen"
            visible={true}
            onCancel={handleCancel}
            okText="Hochladen"
            onOk={handleOk}
            okButtonProps={okButtonProps}
            cancelText="Abbrechen"
        >
            <Spin
                spinning={loading}
                tip="Bitte warten..."
            >
                <Space direction="vertical" size="large" className={styles.wrapper}>
                    <div>
                        <Typography.Title level={3}>Workflow</Typography.Title>
                        <Select
                            className={styles.select}
                            options={selectOptions}
                            value={selectedWorkflow}
                            placeholder="Workflow auswählen..."
                            onChange={handleWorkflowSelected}
                            listHeight={600}
                        />
                    </div>

                    <div>
                        <Typography.Title level={3}>Version</Typography.Title>
                        <Radio.Group onChange={handleVersionChanged} value={version}>
                            <Space direction="vertical" className={styles.wrapper}>
                                <Radio value={nextMajor}>
                                    Major: <strong>v{nextMajor}</strong>
                                    <p className={styles.radioHint}>
                                        Die Hauptversionsnummer (engl. major release) sollte erhöht werden,
                                        wenn der Workflow grundlegend verändert wurde.
                                    </p>
                                </Radio>
                                <Radio value={nextMinor}>
                                    Minor: <strong>v{nextMinor}</strong>
                                    <p className={styles.radioHint}>
                                        Die Nebenversionsnummer (engl. minor release) sollte erhöht werden,
                                        wenn der Workflow erweitert oder nur leicht verändert wurde.
                                    </p>
                                </Radio>
                                <Radio value={nextPatch}>
                                    Patch: <strong>v{nextPatch}</strong>
                                    <p className={styles.radioHint}>
                                        Die Revisionsnummer (engl. patch level) sollte erhöht werden,
                                        wenn lediglich Fehler behoben wurden. Z.B.: Tippfehler, falsche Reihenfolge, ...
                                    </p>
                                </Radio>
                            </Space>
                        </Radio.Group>

                        <Collapse ghost collapsible={packages.length ? undefined : 'disabled'}>
                            <Collapse.Panel header="Vorherige Versionen" key="1">
                                <List
                                    grid={{ gutter: 12, column: 3 }}
                                    size="small"
                                    dataSource={packages}
                                    renderItem={item =>
                                        <List.Item>
                                            <FileOutlined />
                                            {item.replace('.zip', '')}
                                        </List.Item>
                                    }
                                />
                            </Collapse.Panel>
                        </Collapse>
                    </div>

                    <div>
                        <Typography.Title level={3}>Anmeldung (Workflow Registry)</Typography.Title>
                        <Form
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 12 }}
                            name="basic"
                            form={loginForm}
                            onValuesChange={handleLoginValuesChanged}
                        >
                            <Form.Item
                                label="Nutzername"
                                name="username"
                                required
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                required
                            >
                                <Input.Password />
                            </Form.Item>
                        </Form>
                    </div>
                </Space>
            </Spin>
        </Modal>
    );
}
