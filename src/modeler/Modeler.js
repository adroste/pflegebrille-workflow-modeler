import React, { useContext, useEffect, useRef } from 'react';

import BpmnModeler from 'bpmn-js/lib/Modeler';
import { Modal } from 'antd';
import { appContext } from '../base/AppContextProvider';
import { autoColorModule } from '../modeler-modules/autoColor';
import { contextPadProviderModule } from '../modeler-modules/contextPadProvider';
import { germanTranslateModule } from '../modeler-modules/germanTranslate';
import lintModule from 'bpmn-js-bpmnlint';
import { linterConfig } from '../lint/linterConfig';
import minimapModule from 'diagram-js-minimap';
import { modelerContext } from './ModelerContextProvider';
import { paletteProviderModule } from '../modeler-modules/paletteProvider';
import { pbModdle } from '../meta-model/pbModdle';
import styles from './Modeler.module.css';

export function Modeler() {
    const { modeler, setModeler } = useContext(modelerContext);
    const { xml } = useContext(appContext);
    const containerRef = useRef();

    useEffect(() => {
        if (!containerRef)
            return;

        setModeler(curModeler => {
            if (curModeler)
                console.error('ERR: Another modeler is already registered.');

            let newModeler = new BpmnModeler({
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
                ],
                keyboard: {
                    bindTo: document,
                },
                moddleExtensions: {
                    pb: pbModdle,
                },
            });

            return newModeler;
        });

        return () => setModeler(modeler => {
            if (modeler)
                modeler.destroy();
            return null;
        });
    }, [containerRef, setModeler]);

    useEffect(() => {
        if (!modeler || !xml) 
            return;
        modeler.importXML(xml)
            .catch(err => {
                console.error(err);
                Modal.error({
                    title: 'Import Fehler',
                    content: 'Der Workflow konnte nicht geladen werden.\nMöglicherweise ist die BPMN-Datei beschädigt.'
                });
            });
    }, [modeler, xml]);

    return (
        <div
            className={styles.container}
            ref={containerRef}
        />
    );
}