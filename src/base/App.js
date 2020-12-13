import React, { useContext } from 'react';

import { ModelerScreen } from '../screens/ModelerScreen';
import { ScreenEnum } from '../screens/ScreenEnum';
import { XmlEditorScreen } from '../screens/XmlEditorScreen';
import { appContext } from './AppContextProvider';

function App() {

    const { screen } = useContext(appContext);

    if (screen === ScreenEnum.MODELER)
        return <ModelerScreen />

    return <XmlEditorScreen />
}

export default App;
