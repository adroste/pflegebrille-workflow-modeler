import { Button, Space } from 'antd';
import { CloudUploadOutlined, CodeOutlined, FolderOutlined, SnippetsOutlined } from '@ant-design/icons';
import React, { useCallback, useContext, useState } from 'react';

import { AssetManagerDialog } from './AssetManagerDialog';
import { SaveDialog } from './SaveDialog';
import { ScreenEnum } from '../base/ScreenEnum';
import { ZoomControls } from './ZoomControls';
import { appContext } from '../base/AppContextProvider';
import { modelerContext } from './ModelerContextProvider';

export function MenuBar({ className }) {
    const { setInitialXml, setScreen } = useContext(appContext);
    const { getXml } = useContext(modelerContext);
    const [showDialog, setShowDialog] = useState(null);

    const handleCloseDialog = useCallback(() => {
        setShowDialog(null);
    }, []);

    const handleSaveClick = useCallback(() => {
        setShowDialog('save');
    }, []);

    const handleAssetManagerClick = useCallback(async () => {
        setShowDialog('assetManager');
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
            <Button onClick={handleAssetManagerClick}>
                <SnippetsOutlined /> Assets verwalten
            </Button>

            <ZoomControls />

            {showDialog === 'save' &&
                <SaveDialog onClose={handleCloseDialog} />
            }
            {showDialog === 'assetManager' &&
                <AssetManagerDialog onClose={handleCloseDialog} />
            }
        </Space>
    );
}