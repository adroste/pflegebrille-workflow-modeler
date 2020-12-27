import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';
import { isAny } from './util';

export const outgoingFlowRequired = () => ({
    category: RuleCategoryEnum.ERROR,
    factory(binding) {

        function check(node, reporter) {

            if (!isAny(node, binding.appliesTo))
                return;

            const outgoing = node.outgoing || [];

            if (!outgoing.length) {
                reporter.report(node.id, 'Ausgehender Pfad fehlt');
            }
        }

        return { check };
    }
});