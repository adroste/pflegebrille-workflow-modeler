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
