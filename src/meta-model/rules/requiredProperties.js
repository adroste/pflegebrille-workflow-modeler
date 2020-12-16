import { findId, findLabel, isAny } from './util';

import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';

export const requiredProperties = (properties, requiredIf = null) => ({
    category: RuleCategoryEnum.ERROR,
    factory(binding) {

        function check(node, reporter) {
            if (!isAny(node, binding.appliesTo))
                return;

            for (let property of properties) {
                if (
                    (node[property] === undefined
                    || node[property] === null
                    || node[property].length === 0) 
                    && (!requiredIf || requiredIf(node))
                ) {
                    reporter.report(
                        findId(node),
                        `${findLabel(binding, property)} ist erforderlich`
                    );
                }
            }
        }

        return { check };
    }
});