import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { getInnerElements } from '../util';
import { is } from '../meta-model/rules/util';

function BpmnExtensionInserter(
    bpmnjs,
    eventBus,
    moddle,
) {
    const extensionMap = {};
    moddle.registry.packages.forEach(({ types, prefix }) =>
        types?.forEach(({ name, meta }) =>
            meta?.bpmnExtension?.forEach(v => 
                extensionMap[v] = (extensionMap[v] || []).concat(`${prefix}:${name}`))));


    function check({ element }) {
        const bo = getBusinessObject(element);

        if (!bo)
            return;

        // recursive for references
        const innerElements = getInnerElements(bo);
        innerElements.forEach(element => {
            if (Array.isArray(element))
                element.forEach(element => check({ element }));
            else
                check({ element });
        });

        const extensionTypes = extensionMap[bo.$type];

        if (!extensionTypes || extensionTypes.length === 0)
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
    eventBus.on('import.done', () => check({ element: bpmnjs.getDefinitions() }));
}

BpmnExtensionInserter.$inject = [
    'bpmnjs',
    'eventBus',
    'moddle',
];

export const bpmnExtensionInserterModule = {
    __init__: ['bpmnExtensionInserter'],
    'bpmnExtensionInserter': ['type', BpmnExtensionInserter],
};