import { Modal, Result, Typography, Upload } from 'antd';
import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';

import Compressor from 'compressorjs';
import { UploadOutlined } from '@ant-design/icons';
import { appContext } from '../base/AppContextProvider';
import { is } from '../meta-model/rules/util';
import { modelerContext } from './ModelerContextProvider';
import styles from './MediaFileUpload.module.css';

export function MediaFileUpload({ onUpload }) {
    const { setAssetData } = useContext(appContext);
    const { bpmnjs, moddle, eventBus } = useContext(modelerContext);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [convertState, setConvertState] = useState();
    const fileList = useMemo(() => file ? [file] : [], [file]);
    const fileReaderRef = useRef();
    const compressorRef = useRef();
    const workerRef = useRef();

    const okButtonProps = useMemo(() => ({
        loading,
    }), [loading]);

    const handleOk = useCallback(() => {
        setLoading(true);

        const saveAsset = blob => {
            const ext = blob.type.split('/')[1];
            const asset = moddle.create('pb:Asset');
            asset.id = `${moddle.ids.nextPrefixed('Asset_', asset)}.${ext}`;
            asset.name = file.name.replace(/\.[^.]*$/, `.${ext}`);

            setAssetData(data => ({
                ...data,
                [asset.id]: blob,
            }));

            const definitions = bpmnjs.getDefinitions();
            const extElements = definitions.extensionElements;
            const assets = extElements.get('values').find(element => is(element, 'pb:Assets'));
            assets.get('assets').push(asset);
            asset.$parent = assets;
            
            eventBus.fire('elements.changed', { elements: [definitions, extElements, assets, asset] });

            onUpload({ element: asset });
        };

        if (file.type.startsWith('image')) {
            compressorRef.current = new Compressor(file, {
                quality: .8,
                maxHeight: 600,
                maxWidth: 800,
                mimeType: 'image/jpeg',
                success(result) {
                    setLoading(false);
                    compressorRef.current = null;
                    saveAsset(result);
                },
                error(err) {
                    setLoading(false);
                    compressorRef.current = null;
                    console.error(err);
                    Modal.error({
                        title: 'Fehler',
                        content: 'Die Datei konnte nicht konvertiert werden.',
                    });
                }
            });
        } else { // video
            const fr = new FileReader();
            fileReaderRef.current = fr;
            fr.onload = (e) => {
                fileReaderRef.current = null;
                const data = e.target.result;
                const ext = file.type.split('/')[1];

                const worker = new Worker('ffmpeg-worker-mp4.js');
                workerRef.current = worker;
                worker.onmessage = function (e) {
                    const msg = e.data;
                    switch (msg.type) {
                        case 'ready':
                            setConvertState(null);
                            worker.postMessage({
                                type: 'run',
                                MEMFS: [{ name: `input.${ext}`, data }],
                                arguments: [
                                    '-i', `input.${ext}`,
                                    '-c:v', 'libx264',
                                    '-preset', 'veryfast',
                                    '-crf', '23',
                                    '-profile:v', 'baseline',
                                    '-level', '3.0',
                                    '-pix_fmt', 'yuv420p',
                                    '-filter:v', 'scale=480:trunc(ow/a/2)*2',
                                    '-an',
                                    '-movflags', 'faststart',
                                    '-tune', 'fastdecode',
                                    'out.mp4'
                                ]
                            });
                            break;
                        case 'stdout':
                        case 'stderr':
                            console.log(msg.data);
                            const duration = msg.data.match(/Duration: (.*?), start/);
                            const time = msg.data.match(/time=(.*?) bitrate/);
                            if (duration)
                                setConvertState({ duration: duration[1] });
                            else if (time)
                                setConvertState(cur => ({ ...cur, time: time[1] }));
                            break;
                        case 'done':
                            setLoading(false);
                            workerRef.current = null;
                            worker.terminate();
                            console.log('FFMPEG WORKER DONE');
                            const out = msg.data.MEMFS[0].data;
                            const blob = new Blob([out], { type: 'video/mp4' });
                            saveAsset(blob);
                            break;
                        default:
                    }
                };
            }
            fr.onerror = () => { setLoading(false); }
            fr.readAsArrayBuffer(file);
        }
    }, [bpmnjs, eventBus, file, moddle, onUpload, setAssetData]);

    const handleCancel = useCallback(() => {
        if (compressorRef.current)
            compressorRef.current.abort();
        if (fileReaderRef.current)
            fileReaderRef.current.abort();
        if (workerRef.current)
            workerRef.current.terminate();
        setFile(null);
        setLoading(false);
    }, []);

    const handleFileSelect = useCallback(file => {
        if (!file.name.toLowerCase().match(/(.jpg|.jpeg|.png|.mp4|.webm)$/)) {
            Modal.error({
                title: 'Falscher Dateityp',
                content: 'Der Dateityp wird nicht unterstützt.'
            });
            setFile(null);
        } else {
            setFile(file);
        }
        return false; // needed to prevent auto-upload to action url
    }, []);

    return (
        <>
            <Upload.Dragger
                className={styles.uploadDrag}
                accept="image/jpeg,image/png,video/mp4,video/webm"
                beforeUpload={handleFileSelect}
                fileList={fileList}
                showUploadList={false}
            >
                <Result
                    className={styles.inputResult}
                    icon={<UploadOutlined />}
                    title={".jpg, .png, .mp4, .webm"}
                    subTitle="Klicken oder Datei hereinziehen."
                />
            </Upload.Dragger>

            <Modal
                centered
                visible={file}
                title="Medien konvertieren"
                okText="Konvertieren starten"
                okButtonProps={okButtonProps}
                onOk={handleOk}
                cancelText="Abbrechen"
                onCancel={handleCancel}
            >
                <Typography.Paragraph>
                    Damit die Pflegebrille das Bild / Video darstellen kann, muss es in ein passendes Format konvertiert werden.
                </Typography.Paragraph>
                {convertState &&
                    <Typography.Paragraph strong>
                        {convertState.time} / {convertState.duration}
                    </Typography.Paragraph>
                }
            </Modal>
        </>
    );
}