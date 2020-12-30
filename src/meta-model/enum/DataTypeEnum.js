// NEVER change the enum values
export const DataTypeEnum = Object.freeze({
    ALPHANUMERIC_VALUE: 'AlphanumericValue',
    ANY: 'any',
    DIAGNOSIS: 'Diagnosis',
    IMAGE: 'Image',
    MEDICATION: 'Medication',
    NUMERIC_VALUE: 'NumericValue',
    PATIENT: 'Patient',
    WOUND_HISTORY_ENTRY: 'WoundHistoryEntry',
    WOUND_MEASUREMENT: 'WoundMeasurement',
    WOUND: 'Wound',
});

export const DataTypeLabels = {
    [DataTypeEnum.ALPHANUMERIC_VALUE]: 'Alphanumerischer Wert',
    [DataTypeEnum.ANY]: 'Beliebig',
    [DataTypeEnum.DIAGNOSIS]: 'Diagnose',
    [DataTypeEnum.IMAGE]: 'Bild',
    [DataTypeEnum.MEDICATION]: 'Medikation',
    [DataTypeEnum.NUMERIC_VALUE]: 'Numerischer Wert',
    [DataTypeEnum.PATIENT]: 'Patient',
    [DataTypeEnum.WOUND_HISTORY_ENTRY]: 'Wundverlaufseintrag',
    [DataTypeEnum.WOUND_MEASUREMENT]: 'Wundmaße',
    [DataTypeEnum.WOUND]: 'Wunde',
};