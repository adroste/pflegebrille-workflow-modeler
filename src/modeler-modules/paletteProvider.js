class PaletteProvider {
    constructor(
        palette,
        create,
        elementFactory,
        spaceTool,
        lassoTool,
        handTool,
        globalConnect,
        translate
    ) {
        this.palette = palette;
        this.create = create;
        this.elementFactory = elementFactory;
        this.spaceTool = spaceTool;
        this.lassoTool = lassoTool;
        this.handTool = handTool;
        this.globalConnect = globalConnect;
        this.translate = translate;

        palette.registerProvider(this);
    }

    getPaletteEntries(element) {
        const {
            create,
            elementFactory,
            spaceTool,
            lassoTool,
            handTool,
            globalConnect,
            translate,
        } = this;

        function createAction(type, group, className, title, options) {

            function createListener(event) {
                const shape = elementFactory.createShape(Object.assign({
                    type: type
                }, options));

                if (options) {
                    shape.businessObject.di.isExpanded = options.isExpanded;
                }

                create.start(event, shape);
            }

            const shortType = type.replace(/^bpmn:/, '');

            return {
                group: group,
                className: className,
                title: title || translate('Create {type}', {
                    type: shortType
                }),
                action: {
                    dragstart: createListener,
                    click: createListener
                }
            };
        }

        function createSubprocess(event) {
            const subProcess = elementFactory.createShape({
                type: 'bpmn:SubProcess',
                x: 0,
                y: 0,
                isExpanded: true
            });

            const startEvent = elementFactory.createShape({
                type: 'bpmn:StartEvent',
                x: 40,
                y: 82,
                parent: subProcess
            });

            create.start(event, [subProcess, startEvent], {
                hints: {
                    autoSelect: [startEvent]
                }
            });
        }

        return {
            'hand-tool': {
                group: 'tools',
                className: 'bpmn-icon-hand-tool',
                title: translate('Activate the hand tool'),
                action: {
                    click: function (event) {
                        handTool.activateHand(event);
                    }
                }
            },
            'lasso-tool': {
                group: 'tools',
                className: 'bpmn-icon-lasso-tool',
                title: translate('Activate the lasso tool'),
                action: {
                    click: function (event) {
                        lassoTool.activateSelection(event);
                    }
                }
            },
            'space-tool': {
                group: 'tools',
                className: 'bpmn-icon-space-tool',
                title: translate('Activate the create/remove space tool'),
                action: {
                    click: function (event) {
                        spaceTool.activateSelection(event);
                    }
                }
            },
            'global-connect-tool': {
                group: 'tools',
                className: 'bpmn-icon-connection-multi',
                title: translate('Activate the global connect tool'),
                action: {
                    click: function (event) {
                        globalConnect.toggle(event);
                    }
                }
            },
            'tool-separator': {
                group: 'tools',
                separator: true
            },
            'create.start-event': createAction(
                'bpmn:StartEvent', 'event', 'bpmn-icon-start-event-none',
                // translate('Create StartEvent')
            ),
            // 'create.intermediate-event': createAction(
            //     'bpmn:IntermediateThrowEvent', 'event', 'bpmn-icon-intermediate-event-none',
            //     translate('Create Intermediate/Boundary Event')
            // ),
            'create.end-event': createAction(
                'bpmn:EndEvent', 'event', 'bpmn-icon-end-event-none',
                // translate('Create EndEvent')
            ),
            'create.exclusive-gateway': createAction(
                'bpmn:ExclusiveGateway', 'gateway', 'bpmn-icon-gateway-xor',
                // translate('Create Gateway')
            ),
            'create.manual-task': createAction(
                'bpmn:ManualTask', 'activity', 'bpmn-icon-manual-task',
                // translate('Create ManualTask')
            ),
            'create.user-task': createAction(
                'bpmn:UserTask', 'activity', 'bpmn-icon-user-task',
                // translate('Create UserTask')
            ),
            'create.service-task': createAction(
                'bpmn:ServiceTask', 'activity', 'bpmn-icon-service-task',
                // translate('Create ServiceTask')
            ),
            // 'create.task': createAction(
            //     'bpmn:Task', 'activity', 'bpmn-icon-task',
            //     translate('Create Task')
            // ),
            'create.subprocess-expanded': {
                group: 'activity',
                className: 'bpmn-icon-subprocess-expanded',
                title: translate('Create expanded SubProcess'),
                action: {
                    dragstart: createSubprocess,
                    click: createSubprocess
                }
            },
            'create.group': createAction(
                'bpmn:Group', 'artifact', 'bpmn-icon-group',
                // translate('Create Group')
            ),
            // 'create.data-object': createAction(
            //     'bpmn:DataObjectReference', 'data-object', 'bpmn-icon-data-object',
            //     // translate('Create DataObjectReference')
            // ),
            // 'create.data-store': createAction(
            //     'bpmn:DataStoreReference', 'data-store', 'bpmn-icon-data-store',
            //     // translate('Create DataStoreReference')
            // ),
            // 'create.participant-expanded': {
            //     group: 'collaboration',
            //     className: 'bpmn-icon-participant',
            //     title: translate('Create Pool/Participant'),
            //     action: {
            //         dragstart: createParticipant,
            //         click: createParticipant
            //     }
            // },
        };
    }
}

PaletteProvider.$inject = [
    'palette',
    'create',
    'elementFactory',
    'spaceTool',
    'lassoTool',
    'handTool',
    'globalConnect',
    'translate'
];


export const paletteProviderModule = {
    'paletteProvider': ['type', PaletteProvider],
};
