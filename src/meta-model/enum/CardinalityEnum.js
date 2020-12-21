// NEVER change the enum values
export const CardinalityEnum = Object.freeze({
    ONE: '1',
    ONE_TO_INFINITY: '1_infinity',
    ZERO_TO_ONE: '0_1',
    ZERO_TO_INFINITY: '0_infinity',
});

export const CardinalityLabels = {
    [CardinalityEnum.ONE]: 'genau ein Element',
    [CardinalityEnum.ONE_TO_INFINITY]: '1 bis ∞ Elemente',
    [CardinalityEnum.ZERO_TO_ONE]: '0 oder 1 Element',
    [CardinalityEnum.ZERO_TO_INFINITY]: '0 bis ∞ Elemente',
};