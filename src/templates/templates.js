import empty from './bpmn/empty.bpmn';
import patientData from './bpmn/patientData.bpmn';
import woundData from './bpmn/woundData.bpmn';
import woundManagement from './bpmn/woundManagement.bpmn';
import woundManagementOnlyData from './bpmn/woundManagementOnlyData.bpmn';

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
        label: 'Wundmanagement (ohne Anweisungen)',
        src: woundManagementOnlyData,
    },
    {
        label: 'Wundmanagement (mit Anweisungen)',
        src: woundManagement,
    },
];
