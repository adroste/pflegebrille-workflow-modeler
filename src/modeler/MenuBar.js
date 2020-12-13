import { Button, Space } from 'antd';
import { CodeOutlined, FolderOutlined } from '@ant-design/icons';
import React, { useCallback } from 'react';

import { ZoomControls } from './ZoomControls';

export function MenuBar() {
    // const [showXml, setShowXml] = useState(false);

    const handleShowXmlClick = useCallback(() => {
        // setShowXml(true);
    }, []);

    const handleCloseXmlClick = useCallback(() => {
        // setShowXml(false);
    }, []);

    return (
        <>
            <Space>
                <Button onClick={() => alert('dev mode required')}>
                    <FolderOutlined /> Laden / Speichern
                </Button>
                <Button onClick={handleShowXmlClick}>
                    <CodeOutlined /> Zeige XML
                </Button>
                <ZoomControls />
            </Space>
            {/* <XmlViewer 
                onClose={handleCloseXmlClick}
                visible={showXml}
            /> */}
        </>
    );
}