// NEVER change the enum values
export const DataTypeEnum = Object.freeze({
    DATABASE_TRANSACTION: 'DatabaseTransaction',
    DIAGNOSIS_DATA: 'DiagnosisData',
    IMAGE: 'Image',
    MEDICATION_DATA: 'MedicationData',
    PATIENT_DATA: 'PatientData',
    PATIENT_REF: 'PatientRef',
    WOUND_DATA: 'WoundData',
});

export const DataTypeLabels = {
    [DataTypeEnum.DATABASE_TRANSACTION]: 'Datenbanktransaktion',
    [DataTypeEnum.DIAGNOSIS_DATA]: 'Diagnose',
    [DataTypeEnum.IMAGE]: 'Bild',
    [DataTypeEnum.MEDICATION_DATA]: 'Medikation',
    [DataTypeEnum.PATIENT_DATA]: 'Patientendaten',
    [DataTypeEnum.PATIENT_REF]: 'Patient (Referenz/ID)',
    [DataTypeEnum.WOUND_DATA]: 'Wunddaten',
};