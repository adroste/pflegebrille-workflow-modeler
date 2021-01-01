import React, { useCallback, useMemo, useState } from 'react';

import { Modal } from 'antd';

export const modelerContext = React.createContext();

export function ModelerContextProvider({
    children,
}) {
    const [modeler, setModeler] = useState(null);

    const modules = useMemo(() => ({
        backgroundGrid: modeler?.get('backgroundGrid'),
        bpmnjs: modeler?.get('bpmnjs'),
        canvas: modeler?.get('canvas'),
        editorActions: modeler?.get('editorActions'),
        elementRegistry: modeler?.get('elementRegistry'),
        eventBus: modeler?.get('eventBus'),
        linting: modeler?.get('linting'),
        minimap: modeler?.get('minimap'),
        moddle: modeler?.get('moddle'),
        modeling: modeler?.get('modeling'),
        selection: modeler?.get('selection'),
    }), [modeler])

    const getXml = useCallback(() => {
        if (!modeler)
            return;
            
        return modeler.saveXML({ format: true })
            .then(({ xml }) => {
                return xml;
            })
            .catch(err => {
                console.error(err);
                Modal.error({
                    title: 'Export Fehler',
                    content: 'Der Workflow konnte nicht gespeichert werden.\nMöglicherweise ist die BPMN-Datei beschädigt.'
                });
            });
    }, [modeler]);

    const value = useMemo(() => ({
        ...modules,
        getXml,
        modeler,
        setModeler,
    }), [
        getXml,
        modeler, 
        modules,
    ]);

    return (
        <modelerContext.Provider value={value}>
            {children}
        </modelerContext.Provider>
    );
}
