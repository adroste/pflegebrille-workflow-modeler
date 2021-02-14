import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';
import { is } from './util';

export const noUnusedData = () => ({
    category: RuleCategoryEnum.WARN,
    factory(binding) {

        const data = [];
        const refIds = [];

        function leave(node, reporter) {
            if (!is(node, 'bpmn:Definitions'))
                return;

            const unused = data.filter(({ id }) =>
                refIds.every(refId => refId !== id));
            unused.forEach(datum => {
                reporter.report(
                    datum.id,
                    `Datum "${datum.name}" ist unbenutzt.`
                );
            });
        }

        function enter(node, reporter) {
            if (is(node, 'pb:Data')) {
                data.push(...node.get('data'));
            } else {
                const datumRefProps = node.$descriptor?.properties?.filter(
                    ({ name, isReference }) =>
                        isReference && node[name] && is(node[name], 'pb:Datum')
                );

                if (!datumRefProps?.length)
                    return;

                for (let prop of datumRefProps) {
                    refIds.push(node[prop.name].id);
                }
            }
        }

        return { check: { enter, leave } };
    }
});