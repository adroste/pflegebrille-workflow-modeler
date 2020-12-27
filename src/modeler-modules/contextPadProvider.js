import { assign, forEach, isArray } from 'min-dash';

import { is } from 'bpmn-js/lib/util/ModelUtil';
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';
import { isEventSubProcess } from 'bpmn-js/lib/util/DiUtil';

/**
 * A provider for BPMN 2.0 elements context pad
 */
class ContextPadProvider {
    constructor(
        config,
        injector,
        contextPad,
        modeling,
        elementFactory,
        connect,
        create,
        canvas,
        rules,
        translate
    ) {
        config = config || {};

        this.contextPad = contextPad;
        this.modeling = modeling;
        this.elementFactory = elementFactory;
        this.connect = connect;
        this.create = create;
        this.canvas = canvas;
        this.rules = rules;
        this.translate = translate;

        contextPad.registerProvider(this);

        if (config.autoPlace !== false) {
            this.autoPlace = injector.get('autoPlace', false);
        }

    }

    getContextPadEntries(element) {
        const {
            modeling,
            elementFactory,
            connect,
            create,
            rules,
            autoPlace,
            translate
        } = this;

        const actions = {};

        if (element.type === 'label') {
            return actions;
        }

        const businessObject = element.businessObject;

        function startConnect(event, element) {
            connect.start(event, element);
        }

        function removeElement(e) {
            modeling.removeElements([element]);
        }

        /**
         * Create an append action
         *
         * @param {string} type
         * @param {string} className
         * @param {string} [title]
         * @param {Object} [options]
         *
         * @return {Object} descriptor
         */
        function appendAction(type, className, title, options) {

            if (typeof title !== 'string') {
                options = title;
                title = translate('Append {type}', { type: type.replace(/^bpmn:/, '') });
            }

            function appendStart(event, element) {

                const shape = elementFactory.createShape(assign({ type: type }, options));
                create.start(event, shape, {
                    source: element
                });
            }


            const append = autoPlace ? function (event, element) {
                const shape = elementFactory.createShape(assign({ type: type }, options));

                autoPlace.append(element, shape);
            } : appendStart;


            return {
                group: 'model',
                className: className,
                title: title,
                action: {
                    dragstart: appendStart,
                    click: append
                }
            };
        }


        if (is(businessObject, 'bpmn:FlowNode')) {
            if (!is(businessObject, 'bpmn:EndEvent') &&
                !businessObject.isForCompensation &&
                !isEventType(businessObject, 'bpmn:IntermediateThrowEvent', 'bpmn:LinkEventDefinition') &&
                !isEventSubProcess(businessObject)) {

                assign(actions, {
                    'append.append-manual-task': appendAction(
                        'bpmn:ManualTask',
                        'bpmn-icon-manual-task',
                        // translate('Append Task')
                    ),
                    'append.append-user-task': appendAction(
                        'bpmn:UserTask',
                        'bpmn-icon-user-task',
                        // translate('Append Task')
                    ),
                    'append.append-service-task': appendAction(
                        'bpmn:ServiceTask',
                        'bpmn-icon-service-task',
                        // translate('Append Task')
                    ),
                    'append.end-event': appendAction(
                        'bpmn:EndEvent',
                        'bpmn-icon-end-event-none',
                        // translate('Append EndEvent')
                    ),
                    'append.gateway': appendAction(
                        'bpmn:ExclusiveGateway',
                        'bpmn-icon-gateway-xor',
                        // translate('Append Gateway')
                    ),
                });
            }
        }

        if (isAny(businessObject, [
            'bpmn:FlowNode',
            'bpmn:InteractionNode',
            'bpmn:DataObjectReference',
            'bpmn:DataStoreReference'
        ])) {

            assign(actions, {
                'append.text-annotation': appendAction('bpmn:TextAnnotation', 'bpmn-icon-text-annotation'),

                'connect': {
                    group: 'connect',
                    className: 'bpmn-icon-connection-multi',
                    title: translate('Connect using ' +
                        (businessObject.isForCompensation ? '' : 'Sequence/MessageFlow or ') +
                        'Association'),
                    action: {
                        click: startConnect,
                        dragstart: startConnect
                    }
                }
            });
        }

        if (isAny(businessObject, ['bpmn:DataObjectReference', 'bpmn:DataStoreReference'])) {
            assign(actions, {
                'connect': {
                    group: 'connect',
                    className: 'bpmn-icon-connection-multi',
                    title: translate('Connect using DataInputAssociation'),
                    action: {
                        click: startConnect,
                        dragstart: startConnect
                    }
                }
            });
        }

        if (is(businessObject, 'bpmn:Group')) {
            assign(actions, {
                'append.text-annotation': appendAction('bpmn:TextAnnotation', 'bpmn-icon-text-annotation')
            });
        }

        // delete element entry, only show if allowed by rules
        let deleteAllowed = rules.allowed('elements.delete', { elements: [element] });

        if (isArray(deleteAllowed)) {

            // was the element returned as a deletion candidate?
            deleteAllowed = deleteAllowed[0] === element;
        }

        if (deleteAllowed) {
            assign(actions, {
                'delete': {
                    group: 'edit',
                    className: 'bpmn-icon-trash',
                    title: translate('Remove'),
                    action: {
                        click: removeElement
                    }
                }
            });
        }

        return actions;
    }
}

ContextPadProvider.$inject = [
    'config.contextPad',
    'injector',
    'contextPad',
    'modeling',
    'elementFactory',
    'connect',
    'create',
    'canvas',
    'rules',
    'translate'
];


// helpers /////////

function isEventType(eventBo, type, definition) {

    const isType = eventBo.$instanceOf(type);
    let isDefinition = false;

    const definitions = eventBo.eventDefinitions || [];
    forEach(definitions, function (def) {
        if (def.$type === definition) {
            isDefinition = true;
        }
    });

    return isType && isDefinition;
}

export const contextPadProviderModule = {
    'contextPadProvider': ['type', ContextPadProvider],
};