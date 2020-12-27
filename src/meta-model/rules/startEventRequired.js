import { is, isAny } from './util';

import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';

export const startEventRequired = () => ({
    category: RuleCategoryEnum.ERROR,
    factory(binding) {

        function hasStartEvent(node) {
            const flowElements = node.flowElements || [];

            return (
                flowElements.some(node => is(node, 'bpmn:StartEvent'))
            );
        }

        function check(node, reporter) {

            if (!isAny(node, [
                'bpmn:Process',
                'bpmn:SubProcess'
            ])) {
                return;
            }

            if (!hasStartEvent(node)) {
                const type = is(node, 'bpmn:SubProcess') ? 'Subprozess' : 'Prozess';

                reporter.report(node.id, type + ' benötigt Startereignis');
            }
        }

        return { check };
    }
});