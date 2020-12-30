import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';
import { is } from './util';

export const noUnusedAssets = () => ({
    category: RuleCategoryEnum.WARN,
    factory(binding) {

        const assets = [];
        const refIds = [];

        function leave(node, reporter) {
            if (!is(node, 'bpmn:Definitions'))
                return;

            const unused = assets.filter(({ id }) =>
                refIds.every(refId => refId !== id));
            unused.forEach(asset => {
                reporter.report(
                    asset.id,
                    `Asset "${asset.name}" ist unbenutzt.`
                );
            });
        }

        function enter(node, reporter) {
            if (is(node, 'pb:Assets')) {
                assets.push(...node.get('assets'));
            } else {
                const assetRefProps = node.$descriptor.properties.filter(
                    ({ name, isReference }) =>
                        isReference && node[name] && is(node[name], 'pb:Asset')
                );

                for (let prop of assetRefProps) {
                    refIds.push(node[prop.name].id);
                }
            }
        }

        return { check: { enter, leave } };
    }
});