import { findId, is, isAny } from './util';

import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';

export const labelRequiredOnForking = () => ({
    category: RuleCategoryEnum.ERROR,
    factory(binding) {

        function check(node, reporter) {
            // ignore parallel gateways
            if (isAny(node, [
                'bpmn:ParallelGateway',
                'bpmn:EventBasedGateway'
            ])) {
                return;
            }

            if (!isAny(node, [
                'bpmn:Gateway',
                'bpmn:SequenceFlow',
            ])) {
                return;
            }

            const name = (node.name || '').trim();

            // ignore joining gateways
            if (
                is(node, 'bpmn:Gateway')
                && node.outgoing?.length > 1
            ) {
                if (name.length === 0) {
                    reporter.report(
                        findId(node),
                        'Name/Label der Gabelung ist erforderlich'
                    );
                }
            }

            // ignore non alternative sequence flows
            if (
                is(node, 'bpmn:SequenceFlow')
                && node.sourceRef?.outgoing?.length > 1
            ) {
                if (name.length === 0) {
                    reporter.report(
                        findId(node),
                        'Name/Label des Pfades ist erforderlich nach einer Gabelung'
                    );
                }
            }
        }

        return { check };
    }
});