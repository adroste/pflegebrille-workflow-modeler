import { findId, findLabel, isAny } from './util';

import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';

export const sameDataTypeProperties = (datumRefProperties, isError = true) => ({
    category: isError ? RuleCategoryEnum.ERROR : RuleCategoryEnum.WARN,
    factory(binding, modelBindings) {

        function check(node, reporter) {
            if (!isAny(node, binding.appliesTo))
                return;

            const types = new Set();
            for (let name of datumRefProperties) {
                types.add(node[name]?.type);
            }

            if (types.size > 1) {
                const labels = datumRefProperties
                    .map(property => `"${findLabel(modelBindings, node, property)}"`)
                    .join(', ')
                    .replace(/, ([^,]*)$/, ' und $1');
                reporter.report(
                    findId(node),
                    `${labels} müssen den gleichen Datentyp haben`
                );
            }
        }

        return { check };
    }
});