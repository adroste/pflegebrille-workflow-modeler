import { is, isAny } from './meta-model/rules/util';

import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { modelBindings } from './meta-model/modelBindings';

export function getModelBindingsForElement(element) {
    const bo = getBusinessObject(element);
    return modelBindings.filter(({ appliesTo }) => isAny(bo, appliesTo));
}

export function getInnerElements(businessObject) {
    const descriptor = businessObject.$descriptor;
    const innerElements = descriptor?.properties.reduce((innerElements, p) => {
        const el = businessObject[p.name];
        if (el !== null && (typeof el === 'object'))
            // concat works for arrays and single values
            return innerElements.concat(el);
        return innerElements;
    }, []);

    // di property indicates that the element has a rendered shape itself
    // we want to exclude elements that have their own shape
    return innerElements.filter(el => !el.di);
}

export function traverseModdle(element, cb) {
    if (cb(element))
        return;

    let descriptor = element.$descriptor;

    if (descriptor.isGeneric)
        return;

    let containedProperties = descriptor.properties.filter(p => {
        return !p.isAttr && !p.isReference && p.type !== 'String';
    });

    containedProperties.forEach(p => {
        if (p.name in element) {
            const propertyValue = element[p.name];

            if (p.isMany) {
                propertyValue.forEach(child => {
                    traverseModdle(child, cb);
                });
            } else {
                traverseModdle(propertyValue, cb);
            }
        }
    });
}

export function findModdleElementById(moddleRoot, id) {
    let found = null;
    traverseModdle(moddleRoot, (element) => {
        if (element.id === id) {
            found = element;
            return true;
        }
    });
    return found;
}