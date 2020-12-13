import React, { useEffect, useMemo, useState } from 'react';

import testXml from '../wm2.bpmn';

export const appContext = React.createContext();

export function AppContextProvider({
    children,
}) {
    const [xml, setXml] = useState();

    useEffect(() => {
        fetch(testXml)
            .then(res => res.text())
            .then(setXml);
    }, []);

    const value = useMemo(() => ({
        xml,
    }), [
        xml,
    ]);

    return (
        <appContext.Provider value={value}>
            {children}
        </appContext.Provider>
    );
}
