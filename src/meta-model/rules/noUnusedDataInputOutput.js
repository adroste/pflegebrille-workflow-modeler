import { findId, is } from './util';

import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';

export const noUnusedDataInputOutput = () => ({
    category: RuleCategoryEnum.WARN,
    factory(binding) {

        let startNode = null;
        let refs = [];

        function hasRefWithType(ref, type) {
            for (let _ref of refs) {
                if (is(_ref, type) && _ref.dataRef === ref) {
                    return true;
                }
            }
            return false;
        }

        function leave(node, reporter) {
            if (node !== startNode) 
                return;

            node.dataInputAssociations?.forEach(da => {
                const ref = da.sourceRef[0];
                if (ref && !hasRefWithType(ref, 'pb:DataInputRef')) {
                    reporter.report(
                        findId(node),
                        `Unbenutzte Eingabedaten: "${ref.name || ref.id}"`
                    );
                }
            });

            node.dataOutputAssociations?.forEach(da => {
                const ref = da.targetRef;
                if (ref && !hasRefWithType(ref, 'pb:DataOutputRef')) {
                    reporter.report(
                        findId(node),
                        `Unbenutzte Ausgabedaten: "${ref.name || ref.id}"`
                    );
                }
            });

            startNode = null;
            refs = [];
        }

        function enter(node, reporter) {
            if (startNode) { 
                if (is(node, 'pb:DataInputOutputRef')) {
                    refs.push(node);
                }
            } else if (
                node.dataInputAssociations?.length > 0
                || node.dataOutputAssociations?.length > 0
            ) {
                startNode = node;
                refs = [];
            }
        }

        return { check: { enter, leave } };
    }
});