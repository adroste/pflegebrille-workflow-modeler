import { is, isAny } from './meta-model/rules/util';

import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { modelBindings } from './meta-model/modelBindings';

export function getModelBindingsForElement(element) {
    const bo = getBusinessObject(element);
    return modelBindings.filter(({ appliesTo }) => isAny(bo, appliesTo));
}

export function findParent(businessObject, type) {
    function search(bo) {
        if (!bo)
            return null;
        if (is(bo, type))
            return bo;
        return search(bo.$parent);
    }

    return search(businessObject);
}

export function getInnerElements(businessObject) {
    let innerElements = [];
    for (let property in businessObject) {
        if (businessObject.hasOwnProperty(property)) {
            const el = businessObject[property];
            // di property indicates that the element has a rendered shape itself
            // we want to exclude elements that have their own shape
            if (el !== null && (typeof el === 'object') && !el.di) 
                // concat works for arrays and single values
                innerElements = innerElements.concat(el);
        }
    }
    return innerElements;
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