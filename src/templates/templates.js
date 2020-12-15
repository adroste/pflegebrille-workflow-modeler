import empty from './bpmn/empty.bpmn';
import wm2 from './bpmn/wm2.bpmn';

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
        src: wm2,
    },
];
