import { DataTypeEnum } from 'pflegebrille-workflow-meta-model';

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