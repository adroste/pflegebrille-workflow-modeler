import { modelBindings } from '../modelBindings';

/**
 * Checks whether node is of specific bpmn type.
 *
 * @param {ModdleElement} node
 * @param {String} type
 *
 * @return {Boolean}
 */
export function is(node, type) {
    if (type instanceof RegExp) {
        return node.$descriptor?.allTypes?.some(t => type.test(t.name)) || false;
    }

    return (
        (typeof node.$instanceOf === 'function')
            ? node.$instanceOf(type)
            : node.$type === type
    );
}

/**
 * Checks whether node has any of the specified types.
 *
 * @param {ModdleElement} node
 * @param {Array<String>} types
 *
 * @return {Boolean}
 */
export function isAny(node, types) {
    return types.some(function (type) {
        return is(node, type);
    });
}

export function findId(node, withDi = false) {

    function search(node) {
        if (!node)
            return null;

        if (
            !node.id
            || (withDi && !node.di)
        ) {
            return search(node.$parent);
        }

        return node.id;
    }

    const id = search(node);
    if (!id)
        console.error('could not find id for node', node);
    return id;
}

export function findLabel(node, property) {
    const bindings = modelBindings.filter(({ appliesTo }) => isAny(node, appliesTo));
    let field;
    for (let binding of bindings) {
        field = binding.fields?.find(field => field.property === property);
        if (field)
            break;
    }
    return field?.label || property;
}