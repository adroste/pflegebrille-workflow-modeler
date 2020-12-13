import { IssueViewer } from '../modeler/IssueViewer';
import { MenuBar } from '../modeler/MenuBar';
import { Minimap } from '../modeler/Minimap';
import { Modeler } from '../modeler/Modeler';
import { ModelerContextProvider } from '../modeler/ModelerContextProvider';
import { PropertiesPanel } from '../properties-panel/PropertiesPanel';
import React from 'react';
import styles from './App.module.css';

function App() {
    return (
        <div className={styles.wrapper}>
            <ModelerContextProvider>
                <div
                    className={styles.modeler}
                >
                    <Modeler />
                </div>
                <div
                    className={styles.menuBar}
                >
                    <MenuBar />
                </div>
                <PropertiesPanel 
                    className={styles.propertiesPanel}
                />

                <IssueViewer />

                <Minimap />
                
            </ModelerContextProvider>
        </div>
    );
}

export default App;
