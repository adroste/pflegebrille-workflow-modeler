import React, { useContext, useEffect, useRef } from 'react';

import BpmnModeler from 'bpmn-js/lib/Modeler';
import { autoColorModule } from '../modelerModules/autoColor';
import bpmnlintConfig from '../lint/packed-config';
import { contextPadProviderModule } from '../modelerModules/contextPadProvider';
import { germanTranslateModule } from '../modelerModules/germanTranslate';
import lintModule from 'bpmn-js-bpmnlint';
import { modelerContext } from './ModelerContextProvider';
import { paletteProviderModule } from '../modelerModules/paletteProvider';
import styles from './Modeler.module.css';
// import testXml from '../test.bpmn';
// import testXml from '../Wundmanagement.bpmn';
import testXml from '../wm2.bpmn';

export function Modeler() {
    const { setModeler } = useContext(modelerContext);
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
                    bpmnlint: bpmnlintConfig,
                    active: true,
                },
                additionalModules: [
                    autoColorModule,
                    paletteProviderModule,
                    contextPadProviderModule,
                    // customPaletteModule,
                    germanTranslateModule,
                    lintModule,
                ],
                keyboard: {
                    bindTo: document,
                }
            });

            fetch(testXml).then(res => {
                return res.text();
            }).then(xml => {
                newModeler.importXML(xml);
            });

            return newModeler;
        });

        return () => setModeler(null);
    }, [containerRef, setModeler]);

    return (
        <div
            className={styles.container}
            ref={containerRef}
        />
    );
}