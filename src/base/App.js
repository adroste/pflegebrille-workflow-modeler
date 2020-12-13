import React, { useState } from 'react';

import { IssueViewer } from '../modeler/IssueViewer';
import { MenuBar } from '../modeler/MenuBar';
import { Minimap } from '../modeler/Minimap';
import { Modeler } from '../modeler/Modeler';
import { ModelerScreen } from '../screens/ModelerScreen';
import { PropertiesPanel } from '../properties-panel/PropertiesPanel';
import { ScreenEnum } from '../screens/ScreenEnum';
import styles from './App.module.css';

function App() {

    const [screen, setScreen] = useState(ScreenEnum.LOAD_WORKFLOW);


    return (
        <div className={styles.wrapper}>
            <ModelerScreen />
        </div>
    );
}

export default App;
