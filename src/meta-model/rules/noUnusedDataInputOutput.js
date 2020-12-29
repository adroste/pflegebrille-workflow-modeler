import { findId, is, isAny, traverseModdle } from './util';

import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';

export const noUnusedDataInputOutput = () => ({
    category: RuleCategoryEnum.WARN,
    factory(binding) {

        function hasDataInputOutputRefWithId(node, refId) {
            let found = false;
            traverseModdle(node, node => {
                if (
                    is(node, 'pb:DataInputOutputRef')
                    && node.dataRef 
                    && node.dataRef.id === refId
                ) {
                    found = true;
                    return true;
                }
            });
            return found;
        }

        function check(node, reporter) {
            if (!isAny(node, binding.appliesTo))
                return;

            node.dataInputAssociations?.forEach(da => {
                const ref = da.sourceRef[0];
                if (ref && !hasDataInputOutputRefWithId(node, ref.id)) {
                    reporter.report(
                        findId(node),
                        `Unbenutzte Eingabedaten: "${ref.name || ref.id}"`
                    );
                }
            });

            node.dataOutputAssociations?.forEach(da => {
                const ref = da.targetRef;
                if (ref && !hasDataInputOutputRefWithId(node, ref.id)) {
                    reporter.report(
                        findId(node),
                        `Unbenutzte Ausgabedaten: "${ref.name || ref.id}"`
                    );
                }
            });
        }

        return { check };
    }
});