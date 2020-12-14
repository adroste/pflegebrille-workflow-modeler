import React, { useContext, useEffect } from 'react';

import { ModelerScreen } from '../screens/ModelerScreen';
import { ScreenEnum } from '../screens/ScreenEnum';
import { XmlEditorScreen } from '../screens/XmlEditorScreen';
import { appContext } from './AppContextProvider';

function App() {

    const { screen } = useContext(appContext);

    useEffect(() => {
        window.onbeforeunload = (e) => {
            // custom messages only supported in older browsers
            const msg = "Wollen Sie den Modeler wirklich verlassen? Alle ungespeicherten Änderungen gehen verloren!";
            e.preventDefault();
            e.returnValue = msg;
            return msg;
        }
    }, []);

    if (screen === ScreenEnum.MODELER)
        return <ModelerScreen />

    return <XmlEditorScreen />
}

export default App;
