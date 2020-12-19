import { findId, is, isAny } from './util';

import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';

export const noMissingFunctionExtension = () => ({
    category: RuleCategoryEnum.ERROR,
    factory(binding) {

        function check(node, reporter) {
            if (!isAny(node, binding.appliesTo))
                return;

            if (!node.extensionElements?.values?.some(el => is(el, 'pb:Function'))) {
                reporter.report(
                    findId(node),
                    'Keine Funktion definiert.'
                );
            }
        }

        return { check };
    }
});