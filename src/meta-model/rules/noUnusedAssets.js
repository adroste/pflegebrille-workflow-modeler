import { checkIfRef, is, isAny } from './util';

import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';

export const noUnusedAssets = () => ({
    category: RuleCategoryEnum.WARN,
    factory(binding) {

        const assets = [];
        const refs = [];

        function updateReport(reporter) {
            const unused = assets.filter(({ id }) => !refs.some(rId => rId === id));
            reporter.messages = [];
            if (unused.length) {
                unused.forEach(asset => {
                    reporter.report(
                        asset.id,
                        `Asset "${asset.name}" ist unbenutzt.`
                    );
                });
            }
        }

        function check(node, reporter) {

            if (is(node, 'pb:Asset')) {
                assets.push(node);
                updateReport(reporter);
                return;
            }

            if (!isAny(node, binding.appliesTo))
                return;

            for (let prop in node) {
                const ref = checkIfRef(node[prop], 'assetRef');
                if (ref) {
                    refs.push(ref);
                    updateReport(reporter);
                }
            }
        }

        return { check };
    }
});