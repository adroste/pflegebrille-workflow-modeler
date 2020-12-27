import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';
import { isAny } from './util';

export const noDisconnected = () => ({
    category: RuleCategoryEnum.ERROR,
    factory(binding) {

        function check(node, reporter) {

            if (!isAny(node, binding.appliesTo))
                return;

            const incoming = node.incoming || [];
            const outgoing = node.outgoing || [];

            if (!incoming.length && !outgoing.length) {
                reporter.report(node.id, 'Element ist nicht verbunden');
            }
        }

        return { check };
    }
});