import { modelerBindings } from './modelerBindings';
import { pbModdle } from './pbModdle';

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

export function getAllowedFunctionsForType(type) {
    const types = pbModdle.types.filter(t => (
        t.superClass?.includes('Function')
        && t.meta?.allowedIn?.includes(type)
    ));
    return types.map(t => ({
        label: t.meta.title || t.name,
        value: `${pbModdle.prefix}:${t.name}`,
    }));
}

export function getModelerBindingsForType(type) {
    return modelerBindings.filter(({ appliesTo }) => appliesTo.includes(type));
}