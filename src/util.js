import { modelerBindings } from './meta-model/modelerBindings';
import { pbModdle } from './meta-model/pbModdle';

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

// export function traverseModdle(element, cb) {
//     cb(element);

//     let descriptor = element.$descriptor;

//     if (descriptor.isGeneric) {
//         return;
//     }

//     let containedProperties = descriptor.properties.filter(p => {
//         return !p.isAttr && !p.isReference && p.type !== 'String';
//     });

//     containedProperties.forEach(p => {
//         if (p.name in element) {
//             const propertyValue = element[p.name];

//             if (p.isMany) {
//                 propertyValue.forEach(child => {
//                     traverseModdle(child, cb);
//                 });
//             } else {
//                 traverseModdle(propertyValue, cb);
//             }
//         }
//     });
// }