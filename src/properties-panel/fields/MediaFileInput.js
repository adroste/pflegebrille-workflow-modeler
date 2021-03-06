import { Button, Space, Tooltip } from 'antd';
import { CloseOutlined, FolderOpenOutlined } from '@ant-design/icons';
import React, { useCallback, useState } from 'react';

import { AssetManagerDialog } from '../../modeler/AssetManagerDialog';
import { MediaFileUpload } from '../../modeler/MediaFileUpload';
import { MediaPreview } from '../../modeler/MediaPreview';
import styles from './MediaFileInput.module.css';
import { useAssetById } from '../../modeler/useAssets';

export function MediaFileInput({
    onChange,
    value,
}) {
    const [showSelect, setShowSelect] = useState(false);

    const asset = useAssetById(value?.id);

    const handleChange = useCallback(({ element }) => {
        onChange(element);
    }, [onChange]);

    const handleRemove = useCallback(() => {
        onChange(undefined);
        // if (asset?.element?.name) {
        //     Modal.info({
        //         centered: true,
        //         title: 'Datei weiterhin verfügbar.',
        //         content: `Die Datei "${asset.element.name}" ist weiterhin als Asset verfügbar und kann jederzeit erneut über "Vorhandene Datei auswählen" oder "Ersetzen" ausgewählt werden.`
        //     });
        // }
    }, [onChange]);

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
                                type="primary"
                                size="small"
                                onClick={handleSelectExisting}
                                icon={<FolderOpenOutlined />}
                            >
                                Ersetzen
                            </Button>
                            <Tooltip title="Entfernt Asset, ohne es zu löschen">
                            <Button
                                type="ghost"
                                size="small"
                                onClick={handleRemove}
                                icon={<CloseOutlined />}
                            >
                                Entfernen
                            </Button>
                            </Tooltip>
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
                                size="small"
                                onClick={handleSelectExisting}
                                icon={<FolderOpenOutlined />}
                            >
                                Vorhandenes Asset wählen
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