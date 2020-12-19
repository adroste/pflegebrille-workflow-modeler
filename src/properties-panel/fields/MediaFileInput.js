import { Button, Modal, Space } from 'antd';
import { CloseOutlined, FolderOpenOutlined } from '@ant-design/icons';
import React, { useCallback, useState } from 'react';

import { AssetManagerDialog } from '../../modeler/AssetManagerDialog';
import { MediaFileUpload } from '../../modeler/MediaFileUpload';
import { MediaPreview } from '../../modeler/MediaPreview';
import styles from './MediaFileInput.module.css';

export function MediaFileInput({
    onChange,
    value,
}) {
    const [showSelect, setShowSelect] = useState(false);

    const handleUpload = useCallback(({ element }) => {
        onChange(element);
    }, [onChange]);

    const handleRemove = useCallback(() => {
        onChange(null);
        Modal.info({
            centered: true,
            title: 'Datei weiterhin verfügbar.',
            content: `Die Datei "${value.name}" ist weiterhin als Asset verfügbar und kann jederzeit erneut über "Vorhandene Datei auswählen" oder "Ersetzen" ausgewählt werden.`
        });
    }, [onChange, value]);

    const handleSelectExisting = useCallback(() => {
        setShowSelect(true);
    }, []);

    const handleSelectFinish = useCallback(asset => {
        onChange(asset.element);
        setShowSelect(false);
    }, [onChange]);

    const handleSelectClose = useCallback(() => {
        setShowSelect(false);
    }, []);

    return (
        <>
            {value ?
                (
                    <>
                        <MediaPreview id={value.id} />

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
                            onUpload={handleUpload}
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