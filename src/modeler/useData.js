import { is, isAny } from '../meta-model/rules/util';
import { useContext, useEffect, useMemo, useState } from 'react';

import { modelerContext } from './ModelerContextProvider';

function getData(bpmnjs) {
    return (
        bpmnjs
        ?.getDefinitions()
        ?.get('extensionElements')
        ?.get('values')
        ?.find(element => is(element, 'pb:Data'))
        ?.data
    ) || [];
}

export function useData() {
    const { bpmnjs, modeler } = useContext(modelerContext);
    const [data, setData] = useState(() => getData(bpmnjs));

    useEffect(() => {
        if (!modeler)
            return;

        const handleChange = ({ elements }) => {
            if (elements.some(elem => isAny(elem, ['bpmn:Definitions', 'pb:Data', 'pb:Datum']))) {
                setData(getData(bpmnjs));
            }
        };
        modeler.on('elements.changed', handleChange);
        return () => modeler.off('elements.changed', handleChange);
    }, [bpmnjs, modeler]);

    return data;
}

export function useDatumById(id) {
    const data = useData();

    return useMemo(() => ({
        element: id && data.find(datum => datum.id === id)
    }), [data, id]);
}