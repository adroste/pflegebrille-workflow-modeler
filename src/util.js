import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { isAny } from './meta-model/rules/util';
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