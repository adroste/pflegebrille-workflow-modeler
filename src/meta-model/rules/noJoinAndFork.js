import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';
import { isAny } from './util';

export const noJoinAndFork = () => ({
    category: RuleCategoryEnum.ERROR,
    factory(binding) {

        function check(node, reporter) {

            if (!isAny(node, binding.appliesTo))
                return;

            const incoming = node.incoming || [];
            const outgoing = node.outgoing || [];

            if (incoming.length > 1 && outgoing.length > 1) {
                reporter.report(node.id, 'Gleichzeitiges Zusammenführen und Trennen von Pfaden ist nicht erlaubt');
            }
        }

        return { check };
    }
});