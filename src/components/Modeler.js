import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

import React, { useContext, useEffect, useRef } from 'react';

import BpmnModeler from 'bpmn-js/lib/Modeler';
import { germanTranslateModule } from '../modelerModules/germanTranslate';
import { modelerContext } from './ModelerContextProvider';
import styles from './Modeler.module.css';
import testXml from '../test.bpmn';

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
                additionalModules: [
                    germanTranslateModule
                ],
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