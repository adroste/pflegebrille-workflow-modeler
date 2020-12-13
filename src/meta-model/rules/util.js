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

export function findId(node) {

    function search(node) {
        return node ? (node.id || search(node.$parent)) : null;
    }

    const id = search(node);
    if (!id)
        console.error('could not find id for node', node);
    return id;
}

export function findLabel(binding, property) {
    const field = binding?.fields?.find(field => field.property === property);
    return field?.label || property;
}