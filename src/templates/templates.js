import empty from './bpmn/empty.bpmn';
import patientData from './bpmn/patientData.bpmn';
import woundData from './bpmn/woundData.bpmn';
import woundDocumentation from './bpmn/woundDocumentation.bpmn';
import woundDocumentationDataHandling from './bpmn/woundDocumentationDataHandling.bpmn';

export const templates = [
    {
        label: "Leerer Workflow",
        src: empty,
    },
    { 
        label: 'Vorlagen',
        separator: true,
    },
    {
        label: 'Mit Patientendaten',
        src: patientData,
    },
    {
        label: 'Mit Patienten- und Wunddaten',
        src: woundData,
    },
    { 
        label: 'Beispiele',
        separator: true,
    },
    {
        label: 'Wunddokumentation (ohne Anweisungen)',
        src: woundDocumentationDataHandling,
    },
    {
        label: 'Wunddokumentation (mit Anweisungen)',
        src: woundDocumentation,
    },
];
