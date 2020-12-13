import React, { useEffect, useMemo, useState } from 'react';

import { ScreenEnum } from '../screens/ScreenEnum';
import testXml from '../wm2.bpmn';

export const appContext = React.createContext();

export function AppContextProvider({
    children,
}) {
    const [xml, setXml] = useState();
    const [screen, setScreen] = useState(ScreenEnum.MODELER);

    useEffect(() => {
        fetch(testXml)
            .then(res => res.text())
            .then(setXml);
    }, []);

    const value = useMemo(() => ({
        screen,
        setScreen,
        setXml,
        xml,
    }), [
        screen,
        xml,
    ]);

    return (
        <appContext.Provider value={value}>
            {children}
        </appContext.Provider>
    );
}
