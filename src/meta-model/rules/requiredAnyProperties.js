import { findId, findLabel, isAny } from './util';

import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';

export const requiredAnyProperties = (properties, requiredIf = null) => ({
    category: RuleCategoryEnum.ERROR,
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
                const labelMap = properties.reduce((labelMap, property) => {
                    labelMap[property] = findLabel(binding, property);
                    return labelMap;
                }, {});
                properties.forEach(property => {
                    const label = labelMap[property];
                    const otherLabels = properties
                        .filter(p => p !== property)
                        .map(p => labelMap[p])
                        .join(', ')
                        .replace(/, ([^,]*)$/, ' oder $1');
                    reporter.report(
                        findId(node),
                        `${label} ist erforderlich, wenn ${otherLabels} nicht vorhanden`
                    );
                });
            }
        }

        return { check };
    }
});