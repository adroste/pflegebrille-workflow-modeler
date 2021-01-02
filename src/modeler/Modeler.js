import React, { useContext, useEffect, useRef } from 'react';

import BpmnModeler from 'bpmn-js/lib/Modeler';
import { Modal } from 'antd';
import { ScreenEnum } from '../base/ScreenEnum';
import addExporterModule from '@bpmn-io/add-exporter';
import alignToOriginModule from '@bpmn-io/align-to-origin';
import { appContext } from '../base/AppContextProvider';
import { autoColorModule } from '../modeler-modules/autoColor';
import { backgroundGridModule } from '../modeler-modules/backgroundGrid';
import { bpmnExtensionInserterModule } from '../modeler-modules/bpmnExtensionInserter';
import { contextPadProviderModule } from '../modeler-modules/contextPadProvider';
import { germanTranslateModule } from '../modeler-modules/germanTranslate';
import { getAppVersion } from '../util';
import lintModule from 'bpmn-js-bpmnlint';
import { linterConfig } from '../linterConfig';
import minimapModule from 'diagram-js-minimap';
import { modelerContext } from './ModelerContextProvider';
import { paletteProviderModule } from '../modeler-modules/paletteProvider';
import { pbModdle } from '../meta-model/pbModdle';
import styles from './Modeler.module.css';

export function Modeler() {
    const { setModeler } = useContext(modelerContext);
    const { initialXml, setScreen } = useContext(appContext);
    const containerRef = useRef();
    const initialXmlRef = useRef();
    initialXmlRef.current = initialXml;

    useEffect(() => {
        if (!containerRef)
            return;

        const modeler = new BpmnModeler({
            alignToOrigin: {
                alignOnSave: true,
                offset: 250,
                tolerance: 50
            },
            backgroundGrid: {
                defaultVisible: false,
            },
            container: containerRef.current,
            exporter: {
                name: 'pflegebrille-workflow-modeler',
                version: getAppVersion(),
            },
            linting: {
                bpmnlint: linterConfig,
                active: true,
            },
            additionalModules: [
                addExporterModule,
                autoColorModule,
                alignToOriginModule,
                contextPadProviderModule,
                germanTranslateModule,
                backgroundGridModule,
                lintModule,
                minimapModule,
                paletteProviderModule,
                bpmnExtensionInserterModule,
            ],
            keyboard: {
                bindTo: document,
            },
            moddleExtensions: {
                pb: pbModdle,
            },
        });

        if (process.env.NODE_ENV === 'development') {
            window.modeler = modeler;

            const eventBus = modeler.get('eventBus');
            const fire = eventBus.fire;
            eventBus.fire = (type, data, ...args) => {
                console.debug("EVENTBUS", type, data);
                return fire.call(eventBus, type, data, ...args);
            };
        }

        function importXml(xml) {
            return modeler.importXML(xml)
                .then(() => setModeler(modeler))
                .catch(err => {
                    console.error(err);
                    Modal.confirm({
                        title: 'Import Fehler',
                        content: 'Der Workflow konnte nicht geladen werden.\nMöglicherweise ist die BPMN-Datei beschädigt.',
                        cancelText: 'XML-Editor',
                        onCancel() {
                            setScreen(ScreenEnum.XML_EDITOR);
                        },
                        onOk() {
                            setScreen(ScreenEnum.LOAD_WORKFLOW);
                        }
                    });
                });
        }

        let xml = initialXmlRef.current;
        const uriRegex = /(definitions.*xmlns:pb=)"(.+?)"/;
        const match = xml?.match(uriRegex);
        if (match && match[2] !== pbModdle.uri) {
            const getVersion = uri => uri.split('/').pop();
            Modal.confirm({
                title: 'Alte Version',
                content: (
                    <div>
                        <p>Die Workflow Version unterscheidet sich von der aktuellen Version:</p>
                        <p>
                            Workflow Version: {getVersion(match[2])}<br/>
                            Aktuelle Version: {getVersion(pbModdle.uri)}
                        </p>
                    </div>
                ),
                okText: 'Trotzdem laden',
                cancelText: 'Abbrechen',
                onCancel() {
                    setScreen(ScreenEnum.LOAD_WORKFLOW);
                },
                onOk() {
                    // upgrade version
                    xml = xml.replace(uriRegex, `$1"${pbModdle.uri}"`);
                    importXml(xml);
                }
            });
        } else {
            importXml(xml);
        }

        return () => {
            if (modeler)
                // timeout to resolve promises before destroy 
                setTimeout(() => modeler.destroy(), 0);
            setModeler(null);
        }
    }, [containerRef, initialXmlRef, setModeler, setScreen]);

    return (
        <div
            className={styles.container}
            ref={containerRef}
        />
    );
}