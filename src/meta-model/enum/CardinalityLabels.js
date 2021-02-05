import { CardinalityEnum } from 'pflegebrille-workflow-meta-model';

export const CardinalityLabels = {
    [CardinalityEnum.MULTIPLE]: 'mehrere Elemente',
    [CardinalityEnum.ANY]: '1 oder mehrere Elemente',
    [CardinalityEnum.SINGLE]: 'genau ein Element',
};