import React, { useContext, useEffect } from 'react';

import { LoadWorkflowScreen } from '../io/LoadWorkflowScreen';
import { ModelerScreen } from '../modeler/ModelerScreen';
import { ScreenEnum } from './ScreenEnum';
import { XmlEditorScreen } from '../modeler/XmlEditorScreen';
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
    if (screen === ScreenEnum.XML_EDITOR)
        return <XmlEditorScreen />
    else
        return <LoadWorkflowScreen />
}

export default App;
