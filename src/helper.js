export function getElementById(modeler, elementId) {
    if (!modeler)
        return null;
    const elementRegistry = modeler.get('elementRegistry');
    return elementRegistry.get(elementId);
}
