import './App.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

import React, { useEffect, useRef } from 'react';

import BpmnModeler from 'bpmn-js/lib/Modeler';
import testXml from './test.bpmn';

let modeler;

function App() {

    const bRef = useRef();

    useEffect(() => {
        modeler = new BpmnModeler({ 
            container: bRef.current
        });
        fetch(testXml).then(res => {
            return res.text();
        }).then(xml => {
            modeler.importXML(xml);
        });
    }, []);

    return (
        <div className="App" ref={bRef}>
        </div>
    );
}

export default App;
