import React, { useEffect, useMemo, useState } from 'react';

export const modelerContext = React.createContext();

export function ModelerContextProvider({
    children,
}) {
    const [modeler, setModeler] = useState(null);
    const [selectedElements, setSelectedElements] = useState([]);

    const value = useMemo(() => ({
        modeler,
        setModeler,
        selectedElements,
    }), [
        modeler, 
        setModeler,
        selectedElements,
    ]);

    useEffect(() => {
        if (!modeler)
            return;

        const eventHandlers = {

            'element.changed': () => {
                setSelectedElements([...modeler.get('selection').get()]);
            },

            'selection.changed': ({ newSelection }) => {
                setSelectedElements([...newSelection]);
            },

        };

        const events = Object.keys(eventHandlers);
        events.forEach(event => modeler.on(event, eventHandlers[event]));
        return () => events.forEach(event => modeler.off(event, eventHandlers[event]));
    }, [modeler]);


    return (
        <modelerContext.Provider value={value}>
            {children}
        </modelerContext.Provider>
    );
}
