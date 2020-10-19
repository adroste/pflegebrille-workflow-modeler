import { Button, Space } from 'antd';
import { CodeOutlined, FolderOutlined } from '@ant-design/icons';
import React, { useCallback, useState } from 'react';

import { XmlViewer } from './XmlViewer';

export function MenuBar() {
    const [showXml, setShowXml] = useState(false);

    const handleShowXmlClick = useCallback(() => {
        setShowXml(true);
    }, []);

    const handleCloseXmlClick = useCallback(() => {
        setShowXml(false);
    }, []);

    return (
        <>
            <Space>
                <Button>
                    <FolderOutlined /> Laden / Speichern
                </Button>
                <Button onClick={handleShowXmlClick}>
                    <CodeOutlined /> Zeige XML
                </Button>
            </Space>
            <XmlViewer 
                onClose={handleCloseXmlClick}
                visible={showXml}
            />
        </>
    );
}