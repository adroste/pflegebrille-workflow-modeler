import React, { useContext, useEffect, useState } from 'react';

import { CodeSnippet } from './CodeSnippet';
import { Modal } from 'antd';
import { modelerContext } from './ModelerContextProvider';

export function XmlViewer({
    onClose,
    visible,
}) {
    const { modeler } = useContext(modelerContext);
    const [xml, setXml] = useState();

    useEffect(() => {
        if (!modeler || !visible)
            return;

        window.modeler = modeler;
        modeler.saveXML({ format: true }).then(({ xml }) => {
            console.log(xml);
            setXml(xml);
        }).catch(() => {
            setXml(null);
        });
    }, [modeler, visible]);

    return (
        <Modal
            visible={visible}
            onCancel={onClose}
            footer={null}
            width='80vw'
        >
            {xml ?
                (
                    <CodeSnippet language="xml">
                        {xml}
                    </CodeSnippet>
                ) : (
                    "Kein XML geladen."
                )
            }
        </Modal>
    );
}
