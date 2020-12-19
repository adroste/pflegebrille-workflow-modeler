import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Modal } from 'antd';

export const modelerContext = React.createContext();

export function ModelerContextProvider({
    children,
}) {
    const [modeler, setModeler] = useState(null);
    const [selectedElements, setSelectedElements] = useState([]);

    const modules = useMemo(() => ({
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
        selectedElements,
        setModeler,
    }), [
        getXml,
        modeler, 
        modules,
        selectedElements,
    ]);

    useEffect(() => {
        if (!modeler)
            return;

        const eventHandlers = {

            // todo hooks
            'element.changed': () => {
                setSelectedElements([...modules.selection.get()]);
            },

            'selection.changed': ({ newSelection }) => {
                setSelectedElements([...newSelection]);
            },
        };

        const events = Object.keys(eventHandlers);
        events.forEach(event => modeler.on(event, eventHandlers[event]));
        return () => events.forEach(event => modeler.off(event, eventHandlers[event]));
    }, [modeler, modules]);

    return (
        <modelerContext.Provider value={value}>
            {children}
        </modelerContext.Provider>
    );
}
