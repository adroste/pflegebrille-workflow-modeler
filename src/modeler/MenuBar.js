import { Button, Space } from 'antd';
import { CloudUploadOutlined, CodeOutlined, FolderOutlined } from '@ant-design/icons';
import React, { useCallback, useContext, useState } from 'react';

import { SaveDialog } from './SaveDialog';
import { ScreenEnum } from '../base/ScreenEnum';
import { ZoomControls } from './ZoomControls';
import { appContext } from '../base/AppContextProvider';
import { modelerContext } from './ModelerContextProvider';

export function MenuBar({ className }) {
    const { setInitialXml, setScreen } = useContext(appContext);
    const { getXml } = useContext(modelerContext);
    const [showSaveDialoag, setShowSaveDialoag] = useState(false);

    const handleCloseSaveDialog = useCallback(() => {
        setShowSaveDialoag(false);
    }, []);

    const handleSaveClick = useCallback(() => {
        setShowSaveDialoag(true);
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

            <ZoomControls />

            {showSaveDialoag &&
                <SaveDialog onClose={handleCloseSaveDialog} />
            }
        </Space>
    );
}