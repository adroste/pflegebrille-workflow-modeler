import { ArrowLeftOutlined, CloudDownloadOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Space, Spin, Typography } from 'antd';
import React, { useCallback, useContext, useState } from 'react';

import { CreateNewDialog } from './CreateNewDialog';
import { ImportDialog } from './ImportDialog';
import { Screen } from '../base/Screen';
import { ScreenEnum } from '../base/ScreenEnum';
import { appContext } from '../base/AppContextProvider';
import { getAppVersion } from '../util';
import styles from './LoadWorkflowScreen.module.css';

export function LoadWorkflowScreen() {

    const { initialXml, importWorkflow, setScreen } = useContext(appContext);
    const [dialog, setDialog] = useState();
    const [loading, setLoading] = useState(false);

    const handleCreateNew = useCallback(() => setDialog('createNew'), []);
    const handleImport = useCallback(() => setDialog('import'), []);
    const handleCloseDialog = useCallback(() => setDialog(null), []);

    const handleLoad = useCallback(async ({ isZip, data }) => {
        setDialog(null);
        setLoading(true);

        try {
            await importWorkflow({ isZip, data });
            setLoading(false);
            setScreen(ScreenEnum.MODELER);
        } catch (err) {
            setLoading(false);
            Modal.error({
                title: 'Fehler',
                content: 'Der Workflow konnte nicht geladen werden:\n' + err.message,
            });
        }
    }, [importWorkflow, setScreen]);

    const handleBackToModeler = useCallback(() => {
        setScreen(ScreenEnum.MODELER);
    }, [setScreen]);

    return (
        <Screen className={styles.wrapper}>
            <Spin
                spinning={loading}
                tip="Lade Workflow..."
            >
                <div className={styles.inner}>

                    <Typography.Title level={1}>
                        <div className={styles.title}>
                            <img src="android-chrome-192x192.png" alt="" />
                            Pflegebrille Workflow Modeler
                        </div>
                    </Typography.Title>

                    <Divider />

                    <Space direction="vertical" size="large">
                        {initialXml &&
                            <Button
                                shape="round"
                                type="primary"
                                icon={<ArrowLeftOutlined />}
                                onClick={handleBackToModeler}
                                size="large"
                            >
                                Bearbeitung fortsetzen
                            </Button>
                        }

                        <Button
                            shape="round"
                            type={initialXml ? "default" : "primary"}
                            icon={<PlusOutlined />}
                            onClick={handleCreateNew}
                        >
                            Neuen Workflow erstellen
                        </Button>

                        <Button
                            shape="round"
                            icon={<CloudDownloadOutlined />}
                            disabled
                        >
                            Workflow aus Cloud laden
                        </Button>

                        <Button
                            shape="round"
                            icon={<UploadOutlined />}
                            onClick={handleImport}
                        >
                            Workflow importieren
                        </Button>
                    </Space>

                    <Divider />

                    <Typography.Paragraph type="secondary">
                        Version: {getAppVersion()}
                    </Typography.Paragraph>

                    <Typography.Paragraph type="secondary">
                        powered by BPMN.JS
                    </Typography.Paragraph>

                    <Typography.Paragraph type="secondary">
                        Nicht unterstützte Browser: <br/>
                        veraltete Versionen, Internet Explorer, Apple Silicon Mac (M1), Firefox &#x2264; 60, Chrome &#x2264; 55, Safari &#x2264; 11, mobile Browser
                    </Typography.Paragraph>
                </div>
            </Spin>

            {dialog === 'createNew' &&
                <CreateNewDialog
                    onClose={handleCloseDialog}
                    onLoad={handleLoad}
                />
            }
            {dialog === 'import' &&
                <ImportDialog
                    onClose={handleCloseDialog}
                    onLoad={handleLoad}
                />
            }
        </Screen>
    );
}