import { MenuBar } from './MenuBar';
import { Modeler } from './Modeler';
import { ModelerContextProvider } from './ModelerContextProvider';
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
            </ModelerContextProvider>
        </div>
    );
}

export default App;
