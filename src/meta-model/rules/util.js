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

export function findParent(node, type) {
    function search(node) {
        if (!node)
            return null;
        if (is(node, type))
            return node;
        return search(node.$parent);
    }

    return search(node);
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

export function findFieldBinding(node, predicate) {
    const bindings = modelBindings.filter(({ appliesTo }) => isAny(node, appliesTo));
    for (let binding of bindings) {
        let field = binding.fields?.find(predicate);
        if (field)
            return field;
    }
}

export function findLabel(node, property) {
    return findFieldBinding(node, field => field.property === property)?.label || property;
}

export function traverseModdle(node, cb) {
    if (cb(node))
        return;

    let descriptor = node.$descriptor;

    if (descriptor.isGeneric)
        return;

    let containedProperties = descriptor.properties.filter(p => {
        return !p.isAttr && !p.isReference && p.type !== 'String';
    });

    containedProperties.forEach(p => {
        if (p.name in node) {
            const propertyValue = node[p.name];

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
    traverseModdle(moddleRoot, (node) => {
        if (node.id === id) {
            found = node;
            return true;
        }
    });
    return found;
}