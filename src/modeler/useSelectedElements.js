import { useContext, useEffect, useState } from 'react';

import { modelerContext } from './ModelerContextProvider';

export function useSelectedElements() {
    const { modeler } = useContext(modelerContext);
    const [selectedElements, setSelectedElements] = useState([]);

    useEffect(() => {
        if (!modeler)
            return;

        const eventHandlers = {
            // 'elements.changed': () => {
            //     setSelectedElements([...selection.get()]);
            // },

            'selection.changed': ({ newSelection }) => {
                setSelectedElements([...newSelection]);
            },
        };

        const events = Object.keys(eventHandlers);
        events.forEach(event => modeler.on(event, eventHandlers[event]));
        return () => events.forEach(event => modeler.off(event, eventHandlers[event]));
    }, [modeler]);

    return selectedElements;
}