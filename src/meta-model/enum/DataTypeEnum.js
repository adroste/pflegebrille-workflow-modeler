// NEVER change the enum values
export const DataTypeEnum = Object.freeze({
    DATABASE_TRANSACTION: 'DatabaseTransaction',
    IMAGE: 'Image',
    WOUND_DATA: 'WoundData',
});

export const DataTypeLabels = {
    [DataTypeEnum.IMAGE]: 'Bild',
    [DataTypeEnum.WOUND_DATA]: 'Wunddaten',
    [DataTypeEnum.DATABASE_TRANSACTION]: 'Datenbanktransaktion',
};