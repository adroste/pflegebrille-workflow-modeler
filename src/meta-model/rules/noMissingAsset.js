import { checkIfRef, findId, is, isAny } from './util';

import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';

export const noMissingAssets = () => ({
    category: RuleCategoryEnum.ERROR,
    factory(binding) {

        const context = {
            assets: null,
        };

        function getAssets({ moddleRoot }) {
            console.log(moddleRoot);
            context.assets = (
                moddleRoot
                ?.extensionElements
                ?.values
                ?.filter(element => is(element, 'pb:Asset'))
            ) || [];
        }

        function check(node, reporter) {
            if (!isAny(node, binding.appliesTo))
                return;

            for (let prop in node) {
                const ref = checkIfRef(node[prop], 'assetRef');
                if (ref) {
                    if (!context.assets)
                        getAssets(reporter);
                    if (!context.assets.some(({ id }) => id === ref))
                        reporter.report(
                            findId(node),
                            `Referenziertes Asset ist nicht mehr verfügbar.`
                        );
                }
            }
        }

        return { check };
    }
});