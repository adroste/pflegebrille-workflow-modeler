import React, { useContext } from 'react';

import { IssueViewer } from './IssueViewer';
import { MenuBar } from './MenuBar';
import { Minimap } from './Minimap';
import { Modeler } from './Modeler';
import { PropertiesPanel } from '../properties-panel/PropertiesPanel';
import { Screen } from '../base/Screen';
import { modelerContext } from './ModelerContextProvider';
import styles from './ModelerScreen.module.css';

export function ModelerScreen() {

    const { modeler } = useContext(modelerContext);

    return (
        <Screen>

            <Modeler />

            {modeler &&
                <>
                    <MenuBar
                        className={styles.menuBar}
                    />

                    <PropertiesPanel
                        className={styles.propertiesPanel}
                    />

                    <IssueViewer />


                    <Minimap />
                </>
            }

        </Screen>
    );
}