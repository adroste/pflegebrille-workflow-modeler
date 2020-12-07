import pbModdle from './PflegebrilleModdleExtension.json';

const types = pbModdle.types;

export function getAllowedFunctionsForType(type) {
    return types.filter(t => (
        t.superClass?.includes('Function')
        && t.meta?.allowedIn?.includes(type)
    ));
}