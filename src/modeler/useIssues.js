import { useContext, useEffect, useState } from 'react';

import { modelerContext } from './ModelerContextProvider';

export function useIssues() {
    const { modeler, linting } = useContext(modelerContext);
    const [, forceUpdate] = useState();

    useEffect(() => {
        if (!modeler)
            return;

        modeler.on('linting.completed', forceUpdate);
        return () => modeler.off('linting.completed', forceUpdate);
    }, [modeler]);

    return linting?._issues;
}