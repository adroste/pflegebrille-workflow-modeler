import { Divider, Typography } from 'antd';
import React, { useContext } from 'react';

import { ElementProperties } from './ElementProperties';
import { modelerContext } from './ModelerContextProvider';
import styles from './PropertiesPanel.module.css';

export function PropertiesPanel() {
    const { selectedElements } = useContext(modelerContext);

    let element, err;
    if (selectedElements.length === 0)
        err = 'Kein Element ausgewählt.';
    else if (selectedElements.length > 1)
        err = 'Mehrere Elemente ausgewählt.';
    else
        element = selectedElements[0];

    return (
        <>
            <Typography.Title level={2}>
                Eigenschaften
            </Typography.Title>
            <Divider />
            <div className={styles.content}>
                {err ?
                    (
                        <div className={styles.errText}>
                            {err}
                        </div>
                    ) : (
                        <ElementProperties
                            element={element}
                        />
                    )
                }
            </div>
        </>
    );
}