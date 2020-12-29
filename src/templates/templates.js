import empty from './bpmn/empty.bpmn';
import patientData from './bpmn/patientData.bpmn';
import wundmanagement from './bpmn/Wundmanagement.bpmn';

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
        src: null,
    },
    { 
        label: 'Beispiele',
        separator: true,
    },
    {
        label: 'Beispielworkflow: Wundmanagement',
        src: wundmanagement,
    },
];
