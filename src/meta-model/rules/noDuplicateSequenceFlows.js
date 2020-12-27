import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';
import { is } from './util';

export const noDuplicateSequenceFlows = () => ({
    category: RuleCategoryEnum.ERROR,
    factory(binding) {

        const keyed = {};

        function check(node, reporter) {

            if (!is(node, 'bpmn:SequenceFlow')) {
                return;
            }

            const key = flowKey(node);

            if (key in keyed) {
                reporter.report(node.id, 'Pfad ist ein duplikat');
            } else {
                keyed[key] = node;
            }
        }

        return { check };
    }
});

function flowKey(flow) {
    const conditionExpression = flow.conditionExpression;

    const condition = conditionExpression ? conditionExpression.body : '';
    const source = flow.sourceRef ? flow.sourceRef.id : flow.id;
    const target = flow.targetRef ? flow.targetRef.id : flow.id;

    return source + '#' + target + '#' + condition;
}