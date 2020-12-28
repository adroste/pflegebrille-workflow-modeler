// NEVER change the enum values
export const CardinalityEnum = Object.freeze({
    MULTIPLE: 'multiple',
    ANY: 'single_or_multiple',
    SINGLE: 'single',
});

export const CardinalityLabels = {
    [CardinalityEnum.MULTIPLE]: 'mehrere Elemente',
    [CardinalityEnum.ANY]: '1 oder mehrere Elemente',
    [CardinalityEnum.SINGLE]: 'genau ein Element',
};