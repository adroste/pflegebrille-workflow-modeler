import { BulbOutlined, CheckOutlined, CloseOutlined, FileAddOutlined, FileOutlined, FolderOpenOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Space, Tooltip, Typography } from 'antd';
import React, { useCallback, useContext, useState } from 'react';

import { CardinalityEnum } from 'pflegebrille-workflow-meta-model';
import { DataModeEnum } from 'pflegebrille-workflow-meta-model';
import { DatumManagerDialog } from '../../modeler/DatumManagerDialog';
import { is } from '../../meta-model/rules/util';
import { makeId } from '../../util';
import { modelerContext } from '../../modeler/ModelerContextProvider';
import styles from './DatumSelect.module.css';
import { useData } from '../../modeler/useData';

// const NO_DATA_VALUE = '__noData__';
const CREATE_DATA_VALUE = '__createData__';

export function DatumSelect({
    dataCardinality,
    dataMode,
    dataOptional,
    dataType,
    defaultName,
    onChange,
    value,
}) {
    const { moddle, bpmnjs, eventBus } = useContext(modelerContext);
    const [showSelect, setShowSelect] = useState(false);
    const data = useData();

    const isInput = dataMode === DataModeEnum.INPUT;

    const suggestions = [];

    if (!value) {
        if (!isInput) {
            suggestions.push({
                label: "Neue Daten erstellen",
                value: CREATE_DATA_VALUE,
                icon: <PlusOutlined />,
            });
        }

        data.forEach(({ name, id, type, isCollection }) => {
            if (
                type === dataType
                && id !== value?.id
            ) {
                suggestions.push({
                    label: name || id,
                    value: id,
                    icon: isCollection ? <FileAddOutlined /> : <FileOutlined />,
                });
            }
        });
    }

    const createNewData = () => {
        const datum = moddle.create('pb:Datum', {
            id: moddle.ids.nextPrefixed('Datum_'),
            name: `${defaultName} ${makeId(4, { upperCase: true })}`,
            type: dataType,
            isCollection: dataCardinality === CardinalityEnum.MULTIPLE,
        });

        const definitions = bpmnjs.getDefinitions();
        const extElements = definitions.extensionElements;
        const data = extElements.get('values').find(element => is(element, 'pb:Data'));
        data.get('data').push(datum);

        eventBus.fire('elements.changed', { elements: [definitions, extElements, data, datum] });

        onChange(datum);
    };

    const handleRemove = () => {
        onChange(undefined);
    };

    const handleAcceptSuggestion = value => {
        if (value === CREATE_DATA_VALUE) {
            createNewData();
        } else {
            const datum = data.find(({ id }) => id === value);
            onChange(datum);
        }
    };

    const handleSelectExisting = useCallback(() => {
        setShowSelect(true);
    }, []);

    const handleSelectFinish = useCallback(datum => {
        onChange(datum.element);
        setShowSelect(false);
    }, [onChange]);

    const handleSelectClose = useCallback(() => {
        setShowSelect(false);
    }, []);

    return (
        <>
            <Space direction="vertical" className={styles.wrapper}>

                <div className={styles.valueBox}>
                    {value ?
                        (
                            <span>
                                {value.isCollection ? <FileAddOutlined /> : <FileOutlined />}&nbsp;
                                {value.name || value.id}
                                <Tooltip title="Entfernen" placement="top">
                                    <Button
                                        className={styles.removeButton}
                                        type="default"
                                        shape="circle"
                                        icon={<CloseOutlined />}
                                        onClick={handleRemove}
                                    />
                                </Tooltip>
                            </span>
                        ) : (
                            <span>{isInput ? 'Keine Eingabe' : 'Keine Ausgabe'} {dataOptional ? '' : ' (unzulässig)'}</span>
                        )
                    }
                </div>

                {suggestions.length > 0 &&
                    <>
                        <Typography.Text>
                            <BulbOutlined className={styles.bulbIcon} /> Vorschläge:
                        </Typography.Text>

                        <div className={styles.suggestions}>
                            {suggestions.map(({ label, value, icon }) =>
                                <div key={value} className={styles.listItem} data-value={value}>
                                    <span className={styles.listIcon}>{icon}</span>
                                    {label}
                                    <Tooltip title="Vorschlag übernehmen">
                                        <Button
                                            className={styles.acceptButton}
                                            type="default"
                                            size="small"
                                            shape="circle"
                                            icon={<CheckOutlined />}
                                            onClick={() => handleAcceptSuggestion(value)}
                                        />
                                    </Tooltip>
                                </div>
                            )}
                        </div>
                    </>
                }

                <Button
                    block
                    type="primary"
                    size="small"
                    onClick={handleSelectExisting}
                    icon={<FolderOpenOutlined />}
                >
                    Vorhandene Prozessdaten wählen
                </Button>

            </Space>

            {showSelect &&
                <DatumManagerDialog
                    onClose={handleSelectClose}
                    onSelect={handleSelectFinish}
                />
            }
        </>
    );
}