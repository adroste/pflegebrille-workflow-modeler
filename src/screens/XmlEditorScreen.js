import 'codemirror/keymap/vim';

import { Button, Divider, Space } from 'antd';
import React, { useCallback, useContext, useRef, useState } from 'react';

import { ArrowLeftOutlined } from '@ant-design/icons';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import CodeMirror from '@uiw/react-codemirror';
import { Screen } from './Screen';
import { ScreenEnum } from './ScreenEnum';
import { appContext } from '../base/AppContextProvider';
import styles from './XmlEditorScreen.module.css';

export function XmlEditorScreen() {

    const { xml, setXml, setScreen } = useContext(appContext);
    const [vimMode, setVimMode] = useState(false);
    const editorRef = useRef();

    const handleReset = useCallback(() => {
        if (editorRef.current)
            editorRef.current.editor.setValue(xml);
    }, [xml]);

    const handleExit = useCallback(() => {
        const value = editorRef.current?.editor.getValue();
        setXml(value);
        setScreen(ScreenEnum.MODELER);
    }, [setScreen, setXml]);

    const handleVimModeChange = useCallback(e => {
        setVimMode(e.target.checked);
    }, []);

    return (
        <Screen>

            <Space className={styles.menuBar} size="large">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={handleExit}
                >
                    Zurück zum Modeler
                </Button>

                <Button
                    onClick={handleReset}
                >
                    Änderungen verwerfen
                </Button>

                <Divider type="vertical" />

                <Checkbox
                    onChange={handleVimModeChange}
                >
                    Vim-Mode
                </Checkbox>
            </Space>

            <CodeMirror
                ref={editorRef}
                value={xml}
                options={{
                    mode: 'xml',
                    keyMap: vimMode ? 'vim' : 'default',
                }}
            />

        </Screen>
    );
}