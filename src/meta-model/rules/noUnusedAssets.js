import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';
import { is } from './util';

export const noUnusedAssets = () => ({
    category: RuleCategoryEnum.WARN,
    factory(binding) {

        const assets = [];
        const refs = [];

        function updateReport(reporter) {
            const unused = assets.filter(({ id }) => refs.every(({ refId }) => refId !== id));
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

            if (is(node, 'pb:Assets')) {
                assets.push(...node.get('assets'));
                updateReport(reporter);
                return;
            }

            if (is(node, 'pb:AssetRef')) {
                refs.push(node);
                updateReport(reporter);
                return;
            }
        }

        return { check };
    }
});