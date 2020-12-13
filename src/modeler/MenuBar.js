import { Button, Space } from 'antd';
import { CodeOutlined, FolderOutlined } from '@ant-design/icons';
import React, { useCallback, useContext } from 'react';

import { ScreenEnum } from '../screens/ScreenEnum';
import { ZoomControls } from './ZoomControls';
import { appContext } from '../base/AppContextProvider';

export function MenuBar({ className }) {
    const { setScreen } = useContext(appContext);

    const handleShowXmlEditor = useCallback(() => {
        setScreen(ScreenEnum.XML_EDITOR);
    }, [setScreen]);

    return (
        <Space className={className}>
            <Button onClick={() => alert('dev mode required')}>
                <FolderOutlined /> Laden / Speichern
            </Button>
            <Button onClick={handleShowXmlEditor}>
                <CodeOutlined /> XML-Editor
            </Button>
            <ZoomControls />
        </Space>
    );
}