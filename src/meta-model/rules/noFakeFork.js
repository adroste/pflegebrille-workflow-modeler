import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';
import { isAny } from './util';

export const noFakeFork = () => ({
    category: RuleCategoryEnum.ERROR,
    factory(binding) {

        function check(node, reporter) {

            if (!isAny(node, binding.appliesTo))
                return;

            const outgoing = node.outgoing || [];

            const outgoingWithoutCondition = outgoing.filter((flow) => {
                return !hasCondition(flow) && !isDefaultFlow(node, flow);
            });

            if (outgoingWithoutCondition.length > 1) {
                reporter.report(node.id, 'Ausgehende Pfade trennen sich implizit, Gateway erforderlich');
            }
        }

        return { check };
    }
});

function hasCondition(flow) {
    return !!flow.conditionExpression;
}

function isDefaultFlow(node, flow) {
    return node['default'] === flow;
}