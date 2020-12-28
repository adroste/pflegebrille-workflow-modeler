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
            const assetRefProps = node.$descriptor.properties.filter(
                ({ name, isReference }) =>
                    isReference && node[name] && is(node[name], 'pb:Asset')
            );

            if (!assetRefProps.length)
                return;

            if (!context.assets)
                getAssets(reporter);

            for (let prop of assetRefProps) {
                const refId = node[prop.name].id;
                if (context.assets.every(({ id }) => id !== refId)) {
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