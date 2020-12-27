import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';
import { is } from './util';

export const singleBlankStartEventRequired = () => ({
    category: RuleCategoryEnum.ERROR,
    factory(binding) {

        function check(node, reporter) {

            if (!is(node, 'bpmn:FlowElementsContainer')) {
                return;
            }

            const flowElements = node.flowElements || [];

            const blankStartEvents = flowElements.filter(function (flowElement) {

                if (!is(flowElement, 'bpmn:StartEvent')) {
                    return false;
                }

                const eventDefinitions = flowElement.eventDefinitions || [];

                return eventDefinitions.length === 0;
            });

            if (blankStartEvents.length > 1) {
                const type = is(node, 'bpmn:SubProcess') ? 'Subprozess' : 'Prozess';

                reporter.report(node.id, type + ' hat mehrere Startereignisse');
            }
        }

        return { check };
    }
});