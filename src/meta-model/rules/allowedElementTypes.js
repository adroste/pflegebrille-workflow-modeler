import { findId, isAny } from './util';

import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';

export const allowedElementTypes = (types) => ({
    category: RuleCategoryEnum.ERROR,
    factory(binding) {

        function check(node, reporter) {
            if (!isAny(node, types))
                reporter.report(
                    findId(node),
                    `Elementtyp "${node.$type}" ist nicht zulässig bzw. darf nicht verwendet werden`,
                );
        }

        return { check };
    }
});