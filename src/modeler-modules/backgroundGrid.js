import {
    append as svgAppend,
    attr as svgAttr,
    clear as svgClear,
    create as svgCreate
} from 'tiny-svg';

import { query as domQuery } from 'min-dom';

function quantize(value, quantum, fn) {
    if (!fn) {
        fn = 'round';
    }

    return Math[fn](value / quantum) * quantum;
}

function getMid(bounds) {
    function roundPoint(point) {
        return {
            x: Math.round(point.x),
            y: Math.round(point.y)
        };
    }

    return roundPoint({
        x: bounds.x + (bounds.width || 0) / 2,
        y: bounds.y + (bounds.height || 0) / 2
    });
}

const SPACING = 10;

const GRID_COLOR = '#ccc';
const LAYER_NAME = 'djs-grid';

const GRID_DIMENSIONS = {
    width: 100000,
    height: 100000
};

const DEFAULT_CONFIG = {
    defaultVisible: false,
};


class BackgroundGrid {
    constructor(config, canvas, eventBus) {
        this._config = {
            ...DEFAULT_CONFIG,
            ...config,
        };
        this._canvas = canvas;

        eventBus.on('diagram.init', () => {
            this._init();
            this.setVisible(this._config.defaultVisible);
        });

        eventBus.on('canvas.viewbox.changed', context => {
            var viewbox = context.viewbox;
            this._centerGridAroundViewbox(viewbox);
        });
    }

    _init() {
        var defs = domQuery('defs', this._canvas._svg);

        if (!defs) {
            defs = svgCreate('defs');

            svgAppend(this._canvas._svg, defs);
        }

        var pattern = this.pattern = svgCreate('pattern');

        svgAttr(pattern, {
            id: 'djs-grid-pattern',
            width: SPACING,
            height: SPACING,
            patternUnits: 'userSpaceOnUse'
        });

        var circle = this.circle = svgCreate('circle');

        svgAttr(circle, {
            cx: 0.5,
            cy: 0.5,
            r: 0.5,
            fill: GRID_COLOR
        });

        svgAppend(pattern, circle);

        svgAppend(defs, pattern);

        var grid = this.grid = svgCreate('rect');

        svgAttr(grid, {
            x: -(GRID_DIMENSIONS.width / 2),
            y: -(GRID_DIMENSIONS.height / 2),
            width: GRID_DIMENSIONS.width,
            height: GRID_DIMENSIONS.height,
            fill: 'url(#djs-grid-pattern)'
        });
    }

    _centerGridAroundViewbox(viewbox) {
        if (!viewbox) {
            viewbox = this._canvas.viewbox();
        }

        var mid = getMid(viewbox);

        svgAttr(this.grid, {
            x: -(GRID_DIMENSIONS.width / 2) + quantize(mid.x, SPACING),
            y: -(GRID_DIMENSIONS.height / 2) + quantize(mid.y, SPACING)
        });
    }

    isVisible() {
        return this.visible;
    }

    setVisible(visible) {

        if (visible === this.visible) {
            return;
        }

        this.visible = visible;

        var parent = this._getParent();

        if (visible) {
            svgAppend(parent, this.grid);
        } else {
            svgClear(parent);
        }
    }

    _getParent() {
        return this._canvas.getLayer(LAYER_NAME, -2);
    }
}

BackgroundGrid.$inject = [
    'config.backgroundGrid',
    'canvas',
    'eventBus'
];

export const backgroundGridModule = {
    __init__: ['backgroundGrid'],
    'backgroundGrid': ['type', BackgroundGrid]
};