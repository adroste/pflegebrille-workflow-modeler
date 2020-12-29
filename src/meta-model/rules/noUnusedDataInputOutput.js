import { findId, isAny, traverseModdle } from './util';

import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';

export const noUnusedDataInputOutput = () => ({
    category: RuleCategoryEnum.WARN,
    factory(binding) {

        function hasInnerReferenceToId(node, refId) {
            let hasRef = false;
            if (node) {
                traverseModdle(node, node => {
                    const found = node.$descriptor.properties.find(
                        ({ name, isReference }) =>
                            isReference && node[name] && node[name].id === refId
                    );
                    if (found) {
                        hasRef = true;
                        return true; // stops traversal
                    }
                });
            }
            return hasRef;
        }

        function check(node, reporter) {
            if (!isAny(node, binding.appliesTo))
                return;

            node.dataInputAssociations?.forEach(da => {
                const ref = da.sourceRef[0];
                if (ref && !hasInnerReferenceToId(node.extensionElements, ref.id)) {
                    reporter.report(
                        findId(node),
                        `Unbenutzte Eingabedaten: "${ref.name || ref.id}"`
                    );
                }
            });

            node.dataOutputAssociations?.forEach(da => {
                const ref = da.targetRef;
                if (ref && !hasInnerReferenceToId(node.extensionElements, ref.id)) {
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