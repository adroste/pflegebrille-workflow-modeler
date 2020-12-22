import { Button, Modal, Space } from 'antd';
import { CloseOutlined, FolderOpenOutlined } from '@ant-design/icons';
import React, { useCallback, useContext, useState } from 'react';

import { AssetManagerDialog } from '../../modeler/AssetManagerDialog';
import { MediaFileUpload } from '../../modeler/MediaFileUpload';
import { MediaPreview } from '../../modeler/MediaPreview';
import { is } from '../../meta-model/rules/util';
import { modelerContext } from '../../modeler/ModelerContextProvider';
import styles from './MediaFileInput.module.css';
import { useAssetById } from '../../modeler/useAssets';

export function MediaFileInput({
    businessObject,
    onChange,
    value,
}) {
    const { moddle } = useContext(modelerContext);
    const [showSelect, setShowSelect] = useState(false);

    const asset = useAssetById(value?.refId);

    const handleChange = useCallback(({ element }) => {
        let assetRef = value;
        if (!assetRef) {
            assetRef = moddle.create('pb:AssetRef');
            assetRef.$parent = businessObject;
        }
        assetRef.refId = element.id;
        onChange(assetRef);
    }, [businessObject, moddle, onChange, value]);

    const handleRemove = useCallback(() => {
        onChange(undefined);
        Modal.info({
            centered: true,
            title: 'Datei weiterhin verfügbar.',
            content: `Die Datei "${asset.element.name}" ist weiterhin als Asset verfügbar und kann jederzeit erneut über "Vorhandene Datei auswählen" oder "Ersetzen" ausgewählt werden.`
        });
    }, [asset, onChange]);

    const handleSelectExisting = useCallback(() => {
        setShowSelect(true);
    }, []);

    const handleSelectFinish = useCallback(asset => {
        handleChange(asset);
        setShowSelect(false);
    }, [handleChange]);

    const handleSelectClose = useCallback(() => {
        setShowSelect(false);
    }, []);

    return (
        <>
            {value ?
                (
                    <>
                        <MediaPreview id={asset.element?.id} />

                        <Space className={styles.buttons}>
                            <Button
                                type="ghost"
                                onClick={handleSelectExisting}
                                icon={<FolderOpenOutlined />}
                            >
                                Ersetzen
                            </Button>
                            <Button
                                danger
                                ghost
                                onClick={handleRemove}
                                icon={<CloseOutlined />}
                            >
                                Entfernen
                            </Button>
                        </Space>
                    </>
                ) : (
                    <>
                        <MediaFileUpload
                            onUpload={handleChange}
                        />

                        <Space className={styles.buttons}>
                            <span>oder</span>
                            <Button
                                type="primary"
                                onClick={handleSelectExisting}
                                icon={<FolderOpenOutlined />}
                            >
                                Vorhandene Datei wählen
                    </Button>
                        </Space>
                    </>
                )
            }

            {showSelect && 
                <AssetManagerDialog
                    onClose={handleSelectClose}
                    onSelect={handleSelectFinish}
                />
            }
        </>
    );
}