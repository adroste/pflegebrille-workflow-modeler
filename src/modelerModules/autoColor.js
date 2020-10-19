import './autoColor.css';

const shapeColors = {
    'bpmn:ManualTask': { 
        fill: '#ebebf9',
        stroke: '#1978ff',
    },
    'bpmn:UserTask': { 
        fill: '#ebf2eb',
        stroke: '#198c19',
    },
    'bpmn:ServiceTask': { 
        fill: '#f6ebeb',
        stroke: '#ae3f3f',
    },
};


function AutoColor(
    eventBus
) {
    eventBus.on('shape.added', function({ element }) {
        const colors = shapeColors[element.type];
        if (colors) {
            Object.assign(element.businessObject.di, colors);
            // force async rerender
            setTimeout(() => eventBus.fire('element.changed', { element }), 0);
        }
    });
}

AutoColor.$inject = [
    'eventBus',
];


export const autoColorModule = {
    __init__: ['autoColor'],
    'autoColor': ['type', AutoColor],
};