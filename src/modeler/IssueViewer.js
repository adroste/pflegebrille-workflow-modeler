import { Button, Modal, Result } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { IssueList } from './IssueList';
import { jumpToElement } from '../util';
import { modelerContext } from './ModelerContextProvider';
import styles from './IssueViewer.module.css';
import { useIssues } from './useIssues';

export function IssueViewer() {
    const { linting, modeler } = useContext(modelerContext);
    const [open, setOpen] = useState(false);
    const issues = useIssues();

    // override toggle behavior with open/close
    useEffect(() => {
        if (linting)
            linting.toggle = () => setOpen(open => !open);
    }, [linting])

    const handleClose = useCallback(() => setOpen(false), []);

    const handleJumpTo = useCallback(id => {
        setOpen(false);
        jumpToElement(modeler, id);
    }, [modeler]);

    const renderIssues = () => {
        const ids = Object.keys(issues);

        if (ids.length === 0)
            return (
                <Result
                    status='success'
                    title='Keine Fehler gefunden'
                />
            );

        return ids.map(id => (
            <div key={id} className={styles.entry}>
                <div className={styles.heading}>
                    <div>ID: {id}</div>
                    <Button
                        onClick={() => handleJumpTo(id)}
                        type="link"
                    >
                        Zu Element springen
                    </Button>
                </div>
                <IssueList issues={issues[id]} />
            </div>
        ));
    }

    return (
        <Modal
            visible={open}
            onCancel={handleClose}
            footer={null}
            width={600}
            centered
            title="Fehler / Warnungen"
        >
            {open && issues && renderIssues()}
        </Modal>
    );
}