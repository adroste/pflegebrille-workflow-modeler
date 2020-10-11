import { Modeler } from './Modeler';
import { ModelerContextProvider } from './ModelerContextProvider';
import { PropertiesPanel } from './PropertiesPanel';
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
                    className={styles.propertiesPanel}
                    style={{ width: 300 }}
                >
                    <PropertiesPanel />
                </div>
            </ModelerContextProvider>
        </div>
    );
}

export default App;
