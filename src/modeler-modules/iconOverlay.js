import { FileOutlined, FontSizeOutlined, PictureOutlined } from '@ant-design/icons-svg';
import { is, traverseModdle } from '../meta-model/rules/util';

import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { renderIconDefinitionToSVGElement } from '@ant-design/icons-svg/es/helpers';

const OVERLAY_TYPE = 'icon-overlay';

const assetIcon = renderIconDefinitionToSVGElement(PictureOutlined, {
    extraSVGAttrs: { width: '1em', height: '1em', fill: '#444' }
});

const dataIcon = renderIconDefinitionToSVGElement(FileOutlined, {
    extraSVGAttrs: { width: '1em', height: '1em', fill: '#444' }
});

const textIcon = renderIconDefinitionToSVGElement(FontSizeOutlined, {
    extraSVGAttrs: { width: '1em', height: '1em', fill: '#444' }
});

function IconOverlay(
    elementRegistry,
    eventBus,
    overlays,
) {
    function check(el) {
        const bo = getBusinessObject(el);
        if (
            !is(bo, 'bpmn:Activity')
            || !elementRegistry.get(el.id) // element already deleted
        ) {
            return;
        }

        overlays.remove({ element: el, type: OVERLAY_TYPE });

        let hasData = false;
        let hasAsset = false;
        let hasText = false;
        traverseModdle(bo, node => {
            node.$descriptor.properties.forEach(p => {
                if (node[p.name]) {
                    if (p.type === 'pb:Datum')
                        hasData = true;
                    else if (p.type === 'pb:Asset')
                        hasAsset = true;
                    else if (p.name === 'text') // for pb:MediaText
                        hasText = true;
                }
            });
        });

        const icons = [];
        if (hasAsset)
            icons.push(assetIcon);
        if (hasData)
            icons.push(dataIcon);
        if (hasText)
            icons.push(textIcon);

        if (icons.length) {
            overlays.add(el.id, OVERLAY_TYPE, {
                position: {
                    bottom: -4,
                    left: 0
                },
                html: `<div style="width:80px;">${icons.join(' ')}</div>`
            });
        }
    }

    eventBus.on('elements.changed', ({ elements }) => elements.forEach(check));
    eventBus.on('shape.added', ({ element }) => check(element));
}

IconOverlay.$inject = [
    'elementRegistry',
    'eventBus',
    'overlays',
];

export const iconOverlayModule = {
    __init__: ['iconOverlay'],
    'iconOverlay': ['type', IconOverlay],
};