import { findId, findLabel, isAny } from './util';

import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';

export const requiredAnyProperties = (properties, isError = true, requiredIf = null) => ({
    category: isError ? RuleCategoryEnum.ERROR : RuleCategoryEnum.WARN,
    factory(binding) {

        function check(node, reporter) {
            if (!isAny(node, binding.appliesTo))
                return;

            if (
                properties.every(property => (
                    (
                        node[property] === undefined
                        || node[property] === null
                        || node[property].length === 0
                    )
                    && (!requiredIf || requiredIf(node))
                ))
            ) {
                const labels = properties
                    .map(property => findLabel(node, property))
                    .join(', ')
                    .replace(/, ([^,]*)$/, ' oder $1');
                reporter.report(
                    findId(node),
                    `${labels} erforderlich`
                );
            }
        }

        return { check };
    }
});