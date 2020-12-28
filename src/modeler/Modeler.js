import React, { useContext, useEffect, useRef } from 'react';

import BpmnModeler from 'bpmn-js/lib/Modeler';
import { Modal } from 'antd';
import { appContext } from '../base/AppContextProvider';
import { autoColorModule } from '../modeler-modules/autoColor';
import { bpmnExtensionInserterModule } from '../modeler-modules/bpmnExtensionInserter';
import { contextPadProviderModule } from '../modeler-modules/contextPadProvider';
import { germanTranslateModule } from '../modeler-modules/germanTranslate';
import lintModule from 'bpmn-js-bpmnlint';
import { linterConfig } from '../linterConfig';
import minimapModule from 'diagram-js-minimap';
import { modelerContext } from './ModelerContextProvider';
import { paletteProviderModule } from '../modeler-modules/paletteProvider';
import { pbModdle } from '../meta-model/pbModdle';
import styles from './Modeler.module.css';

export function Modeler() {
    const { setModeler } = useContext(modelerContext);
    const { initialXml } = useContext(appContext);
    const containerRef = useRef();
    const initialXmlRef = useRef();
    initialXmlRef.current = initialXml;

    useEffect(() => {
        if (!containerRef)
            return;

        const modeler = new BpmnModeler({
            container: containerRef.current,
            linting: {
                // bpmnlint: bpmnlintConfig,
                bpmnlint: linterConfig,
                active: true,
            },
            additionalModules: [
                // customPaletteModule,
                autoColorModule,
                contextPadProviderModule,
                germanTranslateModule,
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
            const eventBus = modeler.get('eventBus');
            const fire = eventBus.fire;
            eventBus.fire = (type, data, ...args) => {
                console.debug("EVENTBUS", type, data);
                return fire.call(eventBus, type, data, ...args);
            };
        }

        modeler.importXML(initialXmlRef.current)
            .then(() => setModeler(modeler))
            .catch(err => {
                console.error(err);
                Modal.error({
                    title: 'Import Fehler',
                    content: 'Der Workflow konnte nicht geladen werden.\nMöglicherweise ist die BPMN-Datei beschädigt.'
                });
            });

        return () => {
            if (modeler)
                modeler.destroy();
            setModeler(null);
        }
    }, [containerRef, initialXmlRef, setModeler]);

    return (
        <div
            className={styles.container}
            ref={containerRef}
        />
    );
}