import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';
import { is } from './util';

export const superfluousGateway = () => ({
    category: RuleCategoryEnum.WARN,
    factory(binding) {

        function check(node, reporter) {

            if (!is(node, 'bpmn:Gateway')) {
                return;
            }

            const incoming = node.incoming || [];
            const outgoing = node.outgoing || [];

            if (incoming.length === 1 && outgoing.length === 1) {
                reporter.report(node.id, 'Gateway ohne Aufgabe: es werden weder Pfade zusammengeführt, noch getrennt');
            }
        }

        return { check };
    }
});