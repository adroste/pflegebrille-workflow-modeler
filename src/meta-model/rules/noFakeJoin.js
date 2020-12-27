import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';
import { isAny } from './util';

export const noFakeJoin = () => ({
    category: RuleCategoryEnum.ERROR,
    factory(binding) {

        function check(node, reporter) {

            if (!isAny(node, [
                'bpmn:Task',
                'bpmn:Event'
            ])) {
                return;
            }

            const incoming = node.incoming || [];

            if (incoming.length > 1) {
                reporter.report(node.id, 'Eingehende Pfade werden nicht zusammengeführt');
            }
        }

        return { check };
    }
});