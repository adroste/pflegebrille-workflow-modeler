import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';
import { isAny } from './util';

export const incomingFlowRequired = () => ({
    category: RuleCategoryEnum.ERROR,
    factory(binding) {

        function check(node, reporter) {

            if (!isAny(node, binding.appliesTo))
                return;

            const incoming = node.incoming || [];

            if (!incoming.length) {
                reporter.report(node.id, 'Eingehender Pfad fehlt');
            }
        }

        return { check };
    }
});