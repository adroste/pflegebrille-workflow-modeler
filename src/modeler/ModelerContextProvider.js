import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { Modal } from 'antd';
import { appContext } from '../base/AppContextProvider';

export const modelerContext = React.createContext();

export function ModelerContextProvider({
    children,
}) {
    const { setXml } = useContext(appContext);
    const [modeler, setModeler] = useState(null);
    const [selectedElements, setSelectedElements] = useState([]);
    const [issues, setIssues] = useState();

    window.modeler = modeler;

    const modules = useMemo(() => ({
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

    const saveModelerStateToXml = useCallback(() => {
        if (!modeler)
            return;
            
        return modeler.saveXML({ format: true })
            .then(({ xml }) => {
                setXml(xml);
                return xml;
            })
            .catch(err => {
                console.error(err);
                Modal.error({
                    title: 'Export Fehler',
                    content: 'Der Workflow konnte nicht gespeichert werden.\nMöglicherweise ist die BPMN-Datei beschädigt.'
                });
            });
    }, [modeler, setXml]);

    const value = useMemo(() => ({
        ...modules,
        issues,
        modeler,
        saveModelerStateToXml,
        selectedElements,
        setModeler,
    }), [
        issues,
        modeler, 
        modules,
        saveModelerStateToXml,
        selectedElements,
    ]);

    useEffect(() => {
        if (!modeler)
            return;

        const eventHandlers = {

            'element.changed': () => {
                setSelectedElements([...modules.selection.get()]);
            },

            'selection.changed': ({ newSelection }) => {
                setSelectedElements([...newSelection]);
            },

            'linting.completed': ({ issues }) => {
                setIssues(issues);
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
