import empty from './bpmn/empty.bpmn';
import wundmanagement from './bpmn/Wundmanagement.bpmn';

export const templates = [
    {
        label: "Leerer Workflow",
        src: empty,
    },
    {
        label: 'Mit Patientendaten',
        src: null,
    },
    {
        label: 'Mit Patienten- und Wunddaten',
        src: null,
    },
    {
        label: 'Beispielworkflow: Wundmanagement',
        src: wundmanagement,
    },
];
