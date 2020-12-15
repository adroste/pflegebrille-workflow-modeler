import { IssueViewer } from './IssueViewer';
import { MenuBar } from './MenuBar';
import { Minimap } from './Minimap';
import { Modeler } from './Modeler';
import { PropertiesPanel } from '../properties-panel/PropertiesPanel';
import React from 'react';
import { Screen } from '../base/Screen';
import styles from './ModelerScreen.module.css';

export function ModelerScreen() {

    return (
        <Screen>

            <Modeler />

            <MenuBar
                className={styles.menuBar}
            />

            <PropertiesPanel
                className={styles.propertiesPanel}
            />

            <IssueViewer />

            <Minimap />

        </Screen>
    );
}