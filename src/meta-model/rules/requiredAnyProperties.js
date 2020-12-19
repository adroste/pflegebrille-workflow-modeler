import { findId, findLabel, isAny } from './util';

import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';

export const requiredAnyProperties = (properties, isWarning = false, requiredIf = null) => ({
    category: isWarning ? RuleCategoryEnum.WARN : RuleCategoryEnum.ERROR,
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
                    .map(property => findLabel(binding, property))
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