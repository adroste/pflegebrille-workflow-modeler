import { findId, findModdleElementById, isAny } from './meta-model/rules/util';

import { getBBox } from 'diagram-js/lib/util/Elements';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { modelBindings } from './meta-model/modelBindings';

export const getAppVersion = () => {
    const suffix = process.env.REACT_APP_VERSION_NAME_SUFFIX || "";
    return process.env.REACT_APP_VERSION + suffix;
};

export const getWorkflowRegistryUrl = () => {
    return window.runtimeEnv.REACT_APP_WORKFLOW_REGISTRY_URL || "";
};

// also works with URLs
export const pathJoin = (base, ...parts) => {
    const trimSepRight = /\/+$/g;
    const trimSepLeftRight = /^\/+|\/+$/g;
    const partsTrimmed = parts.map(p => p.replace(trimSepLeftRight, ''));
    return [base.replace(trimSepRight, '')].concat(partsTrimmed).join('/');
};

export function getModelBindingsForElement(element) {
    const bo = getBusinessObject(element);
    return modelBindings.filter(({ appliesTo }) => isAny(bo, appliesTo));
}

export function getInnerElements(businessObject) {
    const descriptor = businessObject.$descriptor;
    const innerElements = descriptor?.properties?.reduce((innerElements, p) => {
        const el = businessObject[p.name];
        if (el !== null && (typeof el === 'object'))
            // concat works for arrays and single values
            return innerElements.concat(el);
        return innerElements;
    }, []) || [];

    // di property indicates that the element has a rendered shape itself
    // we want to exclude elements that have their own shape
    return innerElements
        .filter(el => !el.di)
        .filter((el, i, arr) => arr.indexOf(el) === i); // filter for unique
}

export function downloadBlob(blob, filename) {
    const objectUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
}

export function svgUrlToPngBlob(svgUrl) {
    return new Promise(resolve => {
        const img = document.createElement('img');
        img.style = "position: absolute; top: -9999px";
        img.onload = () => {
            document.body.appendChild(img);
            const canvas = document.createElement('canvas');
            canvas.width = img.clientWidth;
            canvas.height = img.clientHeight;
            const ctx = canvas.getContext('2d');

            // white background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(img, 0, 0);
            canvas.toBlob(blob => resolve(blob), 'image/png');
        };
        img.src = svgUrl;
    });
}

export function makeId(length, { upperCase = false }) {
    let id = '';
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        id += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    if (upperCase)
        id = id.toUpperCase();
    return id;
}

export function jumpToElement(modeler, id) {
    const bpmnjs = modeler.get('bpmnjs');
    const canvas = modeler.get('canvas');
    const selection = modeler.get('selection');
    const elementRegistry = modeler.get('elementRegistry');

    const element = findModdleElementById(bpmnjs.getDefinitions(), id);
    const visualId = findId(element, true);
    if (!visualId)
        return;
    const visualElement = elementRegistry.get(visualId);
    if (!visualElement || canvas.getRootElement() === visualElement)
        return;

    const viewbox = canvas.viewbox();
    const box = getBBox(visualElement);

    const newViewbox = {
        x: (box.x + box.width / 2) - viewbox.outer.width / 2,
        y: (box.y + box.height / 2) - viewbox.outer.height / 2,
        width: viewbox.outer.width,
        height: viewbox.outer.height
    };
    canvas.viewbox(newViewbox);
    // canvas.zoom(viewbox.scale); 

    selection.select(visualElement);
}