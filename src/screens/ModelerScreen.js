import { IssueViewer } from '../modeler/IssueViewer';
import { MenuBar } from '../modeler/MenuBar';
import { Minimap } from '../modeler/Minimap';
import { Modeler } from '../modeler/Modeler';
import { PropertiesPanel } from '../properties-panel/PropertiesPanel';
import React from 'react';
import { Screen } from './Screen';
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