import { is, isAny } from '../meta-model/rules/util';
import { useContext, useEffect, useMemo, useState } from 'react';

import { modelerContext } from './ModelerContextProvider';

function getAssets(bpmnjs) {
    return (
        bpmnjs
        ?.getDefinitions()
        ?.get('extensionElements')
        ?.get('values')
        ?.find(element => is(element, 'pb:Assets'))
        ?.assets
    ) || [];
}

export function useAssets() {
    const { bpmnjs, modeler } = useContext(modelerContext);
    const [assets, setAssets] = useState(() => getAssets(bpmnjs));

    useEffect(() => {
        if (!modeler)
            return;

        const handleChange = ({ elements }) => {
            if (elements.some(elem => isAny(elem, ['bpmn:Definitions', 'pb:Assets', 'pb:Asset']))) {
                setAssets(getAssets(bpmnjs));
            }
        };
        modeler.on('elements.changed', handleChange);
        return () => modeler.off('elements.changed', handleChange);
    }, [bpmnjs, modeler]);

    return assets;
}

export function useAssetById(id) {
    const assets = useAssets();

    return useMemo(() => ({
        element: id && assets.find(asset => asset.id === id)
    }), [assets, id]);
}