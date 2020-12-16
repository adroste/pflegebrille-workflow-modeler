import { Button, Modal, Result, Typography, Upload } from 'antd';
import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';

import Compressor from 'compressorjs';
import { UploadOutlined } from '@ant-design/icons';
import { appContext } from '../../base/AppContextProvider';
import styles from './MediaFileInput.module.css';
import { v4 as uuidv4 } from 'uuid';

export function MediaFileInput({
    onChange,
    value,
}) {
    const { assets, setAssets } = useContext(appContext);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [convertState, setConvertState] = useState();
    const fileList = useMemo(() => file ? [file] : [], [file]);
    const fileReaderRef = useRef();
    const compressorRef = useRef();
    const workerRef = useRef();

    const asset = useMemo(() => value && assets[value], [assets, value]);

    const okButtonProps = useMemo(() => ({
        loading,
    }), [loading]);

    const handleOk = useCallback(() => {
        setLoading(true);

        if (file.type.startsWith('image')) {
            compressorRef.current = new Compressor(file, {
                quality: .8,
                maxHeight: 600,
                maxWidth: 800,
                mimeType: 'image/jpeg',
                success(result) {
                    setLoading(false);
                    compressorRef.current = null;
                    const objectUrl = URL.createObjectURL(result);
                    const newPath = `assets/${uuidv4()}.jpg`;
                    setAssets(assets => ({
                        ...assets,
                        [newPath]: {
                            name: file.name,
                            path: newPath,
                            type: result.type,
                            blob: result,
                            objectUrl,
                        },
                    }));
                    onChange(newPath);
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
                            worker.postMessage({
                                type: 'run',
                                MEMFS: [{ name: `input.${ext}`, data }],
                                arguments: [
                                    '-i', `input.${ext}`,
                                    '-an',
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
                            const objectUrl = URL.createObjectURL(blob);
                            const newPath = `assets/${uuidv4()}.${ext}`;
                            setAssets(assets => ({
                                ...assets,
                                [newPath]: {
                                    name: file.name,
                                    path: newPath,
                                    type: blob.type,
                                    blob,
                                    objectUrl,
                                },
                            }));
                            onChange(newPath);
                            break;
                        default:
                    }
                };
            }
            fr.onerror = () => { setLoading(false); }
            fr.readAsArrayBuffer(file);
        }
    }, [file, onChange, setAssets]);

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

    const handleDelete = useCallback(() => {
        Modal.confirm({
            centered: true,
            title: 'Wirklich löschen?',
            danger: true,
            okText: 'Datei löschen',
            cancelText: 'Abbrechen',
            onOk() {
                setFile(null);
                setAssets(assets => {
                    const newAssets = { ...assets };
                    URL.revokeObjectURL(asset.objectUrl);
                    delete newAssets[asset.path];
                    return newAssets;
                });
                onChange('');
            }
        });
    }, [asset, onChange, setAssets]);

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

    if (!asset)
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

    return (
        <>
            <div className={styles.preview}>
                {asset.type.startsWith('image') &&
                    <img
                        className={styles.img}
                        src={asset.objectUrl}
                        alt=""
                    />
                }

                {asset.type.startsWith('video') &&
                    <video
                        className={styles.media}
                        src={asset.objectUrl}
                        controls
                    />
                }
            </div>

            <div className={styles.buttons}>
                <Button
                    danger
                    ghost
                    onClick={handleDelete}
                >
                    Löschen
                </Button>
            </div>
        </>
    );
}