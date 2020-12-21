import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { isAny } from './meta-model/rules/util';
import { modelBindings } from './meta-model/modelBindings';

export function getModelBindingsForElement(element) {
    const bo = getBusinessObject(element);
    return modelBindings.filter(({ appliesTo }) => isAny(bo, appliesTo));
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