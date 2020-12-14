import { Button, Space } from 'antd';
import { CloudUploadOutlined, CodeOutlined, FolderOutlined } from '@ant-design/icons';
import React, { useCallback, useContext, useState } from 'react';

import { SaveDialog } from './SaveDialog';
import { ScreenEnum } from '../screens/ScreenEnum';
import { ZoomControls } from './ZoomControls';
import { appContext } from '../base/AppContextProvider';
import { modelerContext } from './ModelerContextProvider';

export function MenuBar({ className }) {
    const { setScreen } = useContext(appContext);
    const { saveModelerStateToXml } = useContext(modelerContext);
    const [showSaveDialoag, setShowSaveDialoag] = useState(false);

    const handleCloseSaveDialog = useCallback(() => {
        setShowSaveDialoag(false);
    }, []);

    const handleSaveClick = useCallback(() => {
        setShowSaveDialoag(true);
    }, []);

    const handleShowXmlEditor = useCallback(() => {
        saveModelerStateToXml().then(() => {
            setScreen(ScreenEnum.XML_EDITOR);
        });
    }, [saveModelerStateToXml, setScreen]);

    return (
        <Space className={className}>
            <Button onClick={() => alert('dev mode required')}>
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