import { findId, findLabel, is, isAny } from './util';

import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';

export const sameDataTypeProperties = (dataRefProperties, isError = true) => ({
    category: isError ? RuleCategoryEnum.ERROR : RuleCategoryEnum.WARN,
    factory(binding) {

        function check(node, reporter) {
            if (!isAny(node, binding.appliesTo))
                return;

            const types = [];
            for (let name of dataRefProperties) {
                types.push(
                    node
                    ?.[name]
                    ?.dataRef
                    ?.dataObjectRef
                    ?.extensionElements
                    ?.values
                    ?.find(element => is(element, 'pb:DataObjectExtension'))
                    ?.dataType
                );
            }

            if (!types[0] || types.some(type => type !== types[0])) {
                const labels = dataRefProperties
                    .map(property => `"${findLabel(node, property)}"`)
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