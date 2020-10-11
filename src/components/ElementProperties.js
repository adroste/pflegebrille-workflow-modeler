import React, { useContext } from 'react';

import { modelerContext } from './ModelerContextProvider';

export function ElementProperties({
    element,
}) {
    const { modeler } = useContext(modelerContext);

    window.c = () => {

        const modeling = modeler.get('modeling');

        modeling.updateProperties(element, {
            'id': "magmag"
        });
    };

    return (
        <div>
            {element?.id}
            {element?.businessObject.name}
        </div>
    );
}
