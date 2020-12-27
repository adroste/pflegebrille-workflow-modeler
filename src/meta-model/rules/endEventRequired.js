import { is, isAny } from './util';

import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';

export const endEventRequired = () => ({
    category: RuleCategoryEnum.ERROR,
    factory(binding) {

        function hasEndEvent(node) {
            const flowElements = node.flowElements || [];

            return (
                flowElements.some(node => is(node, 'bpmn:EndEvent'))
            );
        }

        function check(node, reporter) {

            if (!isAny(node, [
                'bpmn:Process',
                'bpmn:SubProcess'
            ])) {
                return;
            }

            if (!hasEndEvent(node)) {
                const type = is(node, 'bpmn:SubProcess') ? 'Subprozess' : 'Prozess';

                reporter.report(node.id, type + ' benötigt Endereignis');
            }
        }

        return { check };
    }
});