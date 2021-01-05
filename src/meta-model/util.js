export function enumToSelectOptions(enumType, enumLabels, excludeTypes = []) {
    return Object.values(enumType)
        .map(value => ({
            label: enumLabels[value] || value,
            value,
        }))
        .filter(({ value }) => !excludeTypes.includes(value))
        .sort((a, b) => a.label.localeCompare(b.label));
}