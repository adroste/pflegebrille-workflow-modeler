import { Divider, Typography } from 'antd';
import React, { useContext } from 'react';

import { BaseProperties } from './BaseProperties';
import { ElementProperties } from './ElementProperties';
import { IssueList } from '../modeler/IssueList';
import { modelerContext } from '../modeler/ModelerContextProvider';
import styles from './PropertiesPanel.module.css';
import { useIssues } from '../modeler/useIssues';

export function PropertiesPanel({
    className
}) {
    const { selectedElements } = useContext(modelerContext);
    const issues = useIssues();

    let element, err;
    if (selectedElements.length === 0)
        err = 'Kein Element ausgewählt.';
    else if (selectedElements.length > 1)
        err = 'Mehrere Elemente ausgewählt.';
    else
        element = selectedElements[0];

    const elementIssues = issues?.[element?.id];

    return (
        <div className={`${styles.wrapper} ${className}`}>
            <Typography.Title level={2}>
                Eigenschaften
            </Typography.Title>

            {err ? (
                <div>
                    {err}
                </div>
            ) : (
                <div className={styles.content}>
                    <BaseProperties key={`${element.id}_base`} element={element} />

                    <Divider />

                    <IssueList 
                        className={styles.issueList}
                        issues={elementIssues} 
                    />

                    <ElementProperties 
                        key={element.id} 
                        baseElement={element}
                        element={element} 
                    />
                </div>
            )}
        </div>
    );
}