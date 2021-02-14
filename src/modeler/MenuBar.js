import { Badge, Button, Space } from 'antd';
import { CloudUploadOutlined, CodeOutlined, FolderOutlined, PictureOutlined, SnippetsOutlined } from '@ant-design/icons';
import React, { useCallback, useContext, useState } from 'react';

import { AssetManagerDialog } from './AssetManagerDialog';
import { DatumManagerDialog } from './DatumManagerDialog';
import { SaveDialog } from './SaveDialog';
import { ScreenEnum } from '../base/ScreenEnum';
import { ZoomControls } from './ZoomControls';
import { appContext } from '../base/AppContextProvider';
import { modelerContext } from './ModelerContextProvider';
import styles from './MenuBar.module.css';
import { useAssets } from './useAssets';
import { useData } from './useData';

export function MenuBar({ className }) {
    const { setInitialXml, setScreen } = useContext(appContext);
    const { getXml } = useContext(modelerContext);
    const [showDialog, setShowDialog] = useState(null);

    const assets = useAssets();
    const data = useData();

    const handleCloseDialog = useCallback(() => {
        setShowDialog(null);
    }, []);

    const handleSaveClick = useCallback(() => {
        setShowDialog('save');
    }, []);

    const handleAssetManagerClick = useCallback(async () => {
        setShowDialog('assetManager');
    }, []);
    
    const handleDatumManagerClick = useCallback(async () => {
        setShowDialog('datumManager');
    }, []);

    const handleLoadClick = useCallback(async () => {
        const xml = await getXml();
        setInitialXml(xml);
        setScreen(ScreenEnum.LOAD_WORKFLOW);
    }, [getXml, setInitialXml, setScreen]);

    const handleShowXmlEditor = useCallback(async () => {
        const xml = await getXml();
        setInitialXml(xml);
        setScreen(ScreenEnum.XML_EDITOR);
    }, [getXml, setInitialXml, setScreen]);

    return (
        <Space className={className}>
            <Button onClick={handleLoadClick}>
                <FolderOutlined /> Laden
            </Button>
            <Button onClick={handleSaveClick}>
                <CloudUploadOutlined /> Speichern
            </Button>
            <Button onClick={handleShowXmlEditor}>
                <CodeOutlined /> XML-Editor
            </Button>
            <Badge count={assets.length} showZero size="small" className={styles.badge}>
                <Button onClick={handleAssetManagerClick}>
                    <PictureOutlined /> Assets
                </Button>
            </Badge>
            <Badge count={data.length} showZero size="small" className={styles.badge}>
                <Button onClick={handleDatumManagerClick}>
                    <SnippetsOutlined /> Prozessdaten
                </Button>
            </Badge>

            <ZoomControls />

            {showDialog === 'save' &&
                <SaveDialog onClose={handleCloseDialog} />
            }
            {showDialog === 'assetManager' &&
                <AssetManagerDialog onClose={handleCloseDialog} />
            }
            {showDialog === 'datumManager' &&
                <DatumManagerDialog onClose={handleCloseDialog} />
            }
        </Space>
    );
}