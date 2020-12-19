import { is, isAny } from '../meta-model/rules/util';
import { useContext, useEffect, useState } from 'react';

import { modelerContext } from './ModelerContextProvider';

function getAssets(bpmnjs) {
    return (
        bpmnjs
        .getDefinitions()
        .get('extensionElements')
        ?.get('values')
        ?.filter(element => is(element, 'pb:Asset'))
    ) || [];
}

export function useAssets() {
    const { bpmnjs, modeler } = useContext(modelerContext);
    const [assets, setAssets] = useState(() => getAssets(bpmnjs));

    useEffect(() => {
        const handleChange = ({ elements }) => {
            if (elements.some(elem => isAny(elem, ['bpmn:Definitions', 'pb:Asset']))) {
                setAssets(getAssets(bpmnjs));
            }
        };
        modeler.on('elements.changed', handleChange);
        return () => modeler.off('elements.changed', handleChange);
    }, [bpmnjs, modeler]);

    return assets;
}