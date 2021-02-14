import { Button, Col, Divider, Modal, Row, Tree } from 'antd';
import { CheckOutlined, DeleteOutlined, ExportOutlined, FileAddOutlined, FileOutlined, ImportOutlined, PlusOutlined, WarningOutlined } from '@ant-design/icons';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { findParent, is, traverseModdle } from '../meta-model/rules/util';
import { useData, useDatumById } from './useData';

import { DataModeEnum } from 'pflegebrille-workflow-meta-model';
import { EditDatumForm } from './EditDatumForm';
import { IssueList } from './IssueList';
import { jumpToElement } from '../util';
import { modelerContext } from './ModelerContextProvider';
import styles from './DatumManagerDialog.module.css';
import { useIssues } from './useIssues';

const ADD_KEY = 'addNew';

export function DatumManagerDialog({
    onClose,
    onSelect = null,
}) {
    const { bpmnjs, eventBus, moddle, modeler } = useContext(modelerContext);
    const [selectedKeys, setSelectedKeys] = useState([ADD_KEY]);
    const issues = useIssues();

    const data = useData();
    const datum = useDatumById(selectedKeys[0]);

    const isAddNew = selectedKeys[0] === ADD_KEY;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const remountKey = useMemo(() => Math.random(), [data]);

    const treeData = useMemo(() => {
        const tree = data.map(({ id, name, isCollection }) => ({
            // wrap in span needed for multiple elements with same title
            // because same title nodes will be filtered by antd
            title: <span>{name}</span>,
            key: id,
            isLeaf: true,
            icon: issues?.[id]
                ? <WarningOutlined style={{ color: '#faad14' }} />
                : (isCollection ? <FileAddOutlined /> : <FileOutlined />),
        }));

        tree.push({
            isLeaf: true,
            icon: <PlusOutlined />,
            key: ADD_KEY,
            title: <strong>Neue Prozessdaten erstellen</strong>,
        });

        return tree;
    }, [data, issues]);

    const { inputs, outputs } = useMemo(() => {
        const inputs = [];
        const outputs = [];
        if (datum.element) {
            traverseModdle(bpmnjs.getDefinitions(), node => {
                node.$descriptor.properties.forEach(p => {
                    if (node[p.name] === datum.element) {
                        const activity = findParent(node, 'bpmn:Activity');
                        if (p.meta.dataMode === DataModeEnum.INPUT)
                            inputs.push(activity);
                        else
                            outputs.push(activity);
                    }
                });
            });
        }
        return { inputs, outputs };
    }, [bpmnjs, datum]);

    const issueList = useMemo(() => {
        const list = [];
        data.forEach(({ id }) => {
            if (issues?.[id])
                list.push(...issues[id]);
        });
        return list;
    }, [data, issues]);

    const handleDeleteClick = useCallback(async () => {
        const deleteDatum = () => {
            const definitions = bpmnjs.getDefinitions();
            const extElements = definitions.extensionElements;
            const data = extElements.get('values').find(element => is(element, 'pb:Data'));
            data.data = data.data?.filter(el => el !== datum.element);

            traverseModdle(bpmnjs.getDefinitions(), node => {
                node.$descriptor.properties.forEach(p => {
                    if (node[p.name] === datum.element) {
                        node.set(p.name, undefined);
                        eventBus.fire('elements.changed', { elements: [node] });
                    }
                });
            });

            eventBus.fire('elements.changed', { elements: [definitions, extElements, data] });

            setSelectedKeys([ADD_KEY]);
        };

        Modal.confirm({
            centered: true,
            title: 'Wirklich löschen?',
            content: `Alle Verweise auf das Datum "${datum.element.name}" werden ungültig.`,
            okButtonProps: { danger: true },
            okText: 'Löschen',
            onOk: deleteDatum,
        });
    }, [datum, bpmnjs, eventBus]);

    const handleSave = useCallback(values => {
        let el = datum.element;
        const definitions = bpmnjs.getDefinitions();
        const extElements = definitions.extensionElements;
        const data = extElements.get('values').find(element => is(element, 'pb:Data'));

        if (!el) {
            el = moddle.create('pb:Datum', { id: moddle.ids.nextPrefixed('Datum_') });
            data.get('data').push(el);
        }
        Object.assign(el, values);

        eventBus.fire('elements.changed', { elements: [definitions, extElements, data, el] });
        setSelectedKeys([el.id]);
    }, [bpmnjs, datum.element, eventBus, moddle]);

    const handleSelect = useCallback(() => {
        onSelect(datum);
    }, [datum, onSelect]);

    const handleTreeSelect = useCallback(selectedKeys => {
        setSelectedKeys(selectedKeys);
    }, []);

    const handleJumpTo = useCallback(id => {
        onClose();
        jumpToElement(modeler, id);
    }, [modeler, onClose]);

    const renderIoItems = (io) => (
        io.map(({ id, name }) => (
            <li>
                <div className={styles.ioItem}>
                    ID: {id}
                    <Button
                        type="link"
                        onClick={() => handleJumpTo(id)}
                    >
                        Zu Element springen
                    </Button>
                </div>
                <i>{name}</i>
            </li>
        ))
    );

    return (
        <Modal
            centered
            visible={true}
            title="Prozessdaten verwalten"
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
                        disabled={!datum.element}
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
                    {!isAddNew &&
                        <>
                            <div>
                                <ExportOutlined className={styles.dataOutputIcon} /> Datenausgabe von:
                                {outputs.length === 0 && <i> kein Element</i>}
                            </div>
                            <ul>
                                {renderIoItems(outputs)}
                            </ul>
                            <div>
                                <ImportOutlined className={styles.dataInputIcon} /> Dateneingabe für:
                                {inputs.length === 0 && <i> kein Element</i>}
                            </div>
                            <ul>
                                {renderIoItems(inputs)}
                            </ul>
                            <Divider />
                        </>
                    }

                    <EditDatumForm
                        key={selectedKeys[0]}
                        initialValues={datum.element}
                        onFinish={handleSave}
                        submitText={isAddNew ? 'Erstellen' : 'Speichern'}
                        extraButtons={
                            !isAddNew &&
                            <Button
                                onClick={handleDeleteClick}
                                danger
                                icon={<DeleteOutlined />}
                            >
                                Löschen
                            </Button>
                        }
                    />
                </Col>
            </Row>
        </Modal>
    );
}