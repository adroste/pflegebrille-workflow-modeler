import { Button, Modal, Result } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { IssueList } from './IssueList';
import { findId } from '../meta-model/rules/util';
import { findModdleElementById } from '../util';
import { getBBox } from 'diagram-js/lib/util/Elements';
import { modelerContext } from './ModelerContextProvider';
import styles from './IssueViewer.module.css';
import { useIssues } from './useIssues';

export function IssueViewer() {
    const { bpmnjs, linting, canvas, elementRegistry, selection } = useContext(modelerContext);
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

        const element = findModdleElementById(bpmnjs.getDefinitions(), id);
        const visualId = findId(element, true);
        if (!visualId)
            return;
        const visualElement = elementRegistry.get(visualId);
        if (!visualElement || canvas.getRootElement() === visualElement)
            return;

        const viewbox = canvas.viewbox();
        const box = getBBox(visualElement);

        const newViewbox = {
            x: (box.x + box.width / 2) - viewbox.outer.width / 2,
            y: (box.y + box.height / 2) - viewbox.outer.height / 2,
            width: viewbox.outer.width,
            height: viewbox.outer.height
        };
        canvas.viewbox(newViewbox);
        // canvas.zoom(viewbox.scale); 

        selection.select(visualElement);
    }, [bpmnjs, canvas, elementRegistry, selection]);

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