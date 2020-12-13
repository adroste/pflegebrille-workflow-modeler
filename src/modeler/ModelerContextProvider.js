import React, { useEffect, useMemo, useState } from 'react';

export const modelerContext = React.createContext();

export function ModelerContextProvider({
    children,
}) {
    const [modeler, setModeler] = useState(null);
    const [selectedElements, setSelectedElements] = useState([]);
    const [issues, setIssues] = useState();

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

    window.modeler = modeler;

    const value = useMemo(() => ({
        ...modules,
        issues,
        modeler,
        selectedElements,
        setModeler,
    }), [
        issues,
        modeler, 
        modules,
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
