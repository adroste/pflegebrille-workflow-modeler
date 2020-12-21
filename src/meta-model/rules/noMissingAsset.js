import { findId, is } from './util';

import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';

export const noMissingAssets = () => ({
    category: RuleCategoryEnum.ERROR,
    factory(binding) {

        const context = {
            assets: null,
        };

        function getAssets({ moddleRoot }) {
            context.assets = (
                moddleRoot
                ?.extensionElements
                ?.values
                ?.find(element => is(element, 'pb:Assets'))
                ?.assets
            ) || [];
        }

        function check(node, reporter) {
            if (!is(node, 'pb:AssetRef'))
                return;

            if (!context.assets)
                getAssets(reporter);
            if (context.assets.every(({ id }) => id !== node.refId))
                reporter.report(
                    findId(node),
                    `Referenziertes Asset ist nicht mehr verfügbar.`
                );
        }

        return { check };
    }
});