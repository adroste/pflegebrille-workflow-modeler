import { findId, isAny } from './util';

import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';

export const labelRequired = (isError = false) => ({
    category: isError ? RuleCategoryEnum.ERROR : RuleCategoryEnum.WARN,
    factory(binding) {

        function check(node, reporter) {
            if (!isAny(node, binding.appliesTo))
                return;

            const name = (node.name || '').trim();
            if (name.length === 0) {
                reporter.report(
                    findId(node),
                    'Name/Label fehlt'
                );
            }
        }

        return { check };
    }
});