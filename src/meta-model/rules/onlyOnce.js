import { findId, isAny } from './util';

import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';

// make sure that the specified type only occurs once in the process
export const onlyOnce = () => ({
    category: RuleCategoryEnum.ERROR,
    factory(binding) {

        const map = {};

        function check(node, reporter) {

            if (!isAny(node, binding.appliesTo))
                return;

            const type = node.$type;
            if (map[type]) {
                reporter.report(findId(node), `"${type}" darf nicht mehr als ein Mal pro Workflow enthalten sein`);
            }

            map[type] = true;
        }

        return { check };
    }
});