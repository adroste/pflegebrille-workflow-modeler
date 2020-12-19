import { useContext, useEffect, useMemo, useState } from 'react';

import { isAny } from '../meta-model/rules/util';
import { modelerContext } from './ModelerContextProvider';

function getAssets(bpmnjs) {
    return [...bpmnjs.getDefinitions().get('assets')];
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

export function useAssetByPath(path) {
    const assets = useAssets();

    return useMemo(() => ({
        element: assets.find(asset => path === asset.path)
    }), [assets, path]);
}