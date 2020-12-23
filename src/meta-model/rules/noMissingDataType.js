import { findId, is } from './util';

import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';

export const noMissingDataType = () => ({
    category: RuleCategoryEnum.ERROR,
    factory(binding) {

        function getDataObjectExtension(node) {
            return node
                ?.dataObjectRef
                ?.extensionElements
                ?.values
                ?.find(element => is(element, 'pb:DataObjectExtension'));
        }

        function check(node, reporter) {
            if (!is(node, 'bpmn:DataObjectReference'))
                return;

            const doExt = getDataObjectExtension(node);
            if (!doExt?.dataType)
                reporter.report(
                    findId(node),
                    'Datentyp ist erforderlich'
                );
        }

        return { check };
    }
});