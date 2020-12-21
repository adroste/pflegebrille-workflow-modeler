import { is, isAny } from '../meta-model/rules/util';

import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { modelBindings } from '../meta-model/modelBindings';

function BpmnExtensionInserter(
    eventBus,
    moddle,
) {
    function check({ element }) {
        const bo = getBusinessObject(element);
        const extensionTypes = modelBindings.reduce((extensionTypes, { appliesTo, extensions }) => {
            if (extensions && isAny(bo, appliesTo))
                extensionTypes.push(...extensions);
            return extensionTypes;
        }, []);

        if (extensionTypes.length === 0)
            return;

        let extElements = bo.get('extensionElements');
        if (!extElements) {
            extElements = moddle.create('bpmn:ExtensionElements');
            extElements.$parent = bo;
            bo.set('extensionElements', extElements);
            eventBus.fire('elements.changed', { elements: [element] });
        }
        const values = extElements.get('values');

        for (let extensionType of extensionTypes) {
            if (!values.some(ext => is(ext, extensionType))) {
                const extension = moddle.create(extensionType);
                extension.$parent = extElements;
                values.push(extension);
                eventBus.fire('elements.changed', { elements: [element, extElements] });
            }
        }
    }

    eventBus.on('shape.added', check);
    eventBus.on('bpmnElement.added', check);
}

BpmnExtensionInserter.$inject = [
    'eventBus',
    'moddle',
];

export const bpmnExtensionInserterModule = {
    __init__: ['bpmnExtensionInserter'],
    'bpmnExtensionInserter': ['type', BpmnExtensionInserter],
};