export function enumToModdleEnum(name, enumType) {
    const moddleEnum = {
        name,
        literalValues: [],
    };
    for (let p in enumType) {
        if (enumType.hasOwnProperty(p)) {
            moddleEnum.literalValues.push({
                name: enumType[p],
            });
        }
    }
    return moddleEnum;
}

export function enumToSelectOptions(enumType, enumLabels) {
    return Object.values(enumType).map(value => ({
        label: enumLabels[value] || value,
        value,
    }));
}