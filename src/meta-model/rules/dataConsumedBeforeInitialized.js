import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';
import { is } from './util';

export const dataConsumedBeforeInitialized = () => ({
    category: RuleCategoryEnum.ERROR,
    factory(binding) {

        let availableDataMap;

        function createMap(moddleRoot) {

            function add(id, values) {
                let set = availableDataMap[id];
                if (!set) {
                    set = new Set();
                    availableDataMap[id] = set;
                }
                values?.forEach(set.add, set);
            }

            function next(el, newAvailableData) { // dfs
                add(el.id, newAvailableData);
                // get previous available data
                el.incoming?.forEach(({ sourceRef }) => {
                    if (sourceRef.flowElements) { // subprocess, process, ...
                        sourceRef.flowElements.forEach(flowElement => {
                            if (is(flowElement, 'bpmn:EndEvent'))
                                add(el.id, availableDataMap[flowElement.id]);
                        })
                    } else {
                        add(el.id, availableDataMap[sourceRef.id]);
                    }
                });

                const nextElements = []; 

                const dataOutputs = el
                    ?.dataOutputAssociations
                    ?.map(({ targetRef }) => targetRef) || [];

                if (el.flowElements) { // subprocess, process, ...
                    const start = el.flowElements?.find(el => el && is(el, 'bpmn:StartEvent'));
                    if (start) {
                        nextElements.push(start);
                        add(start.id, availableDataMap[el.id]);
                    }
                } 
                const outgoing = el.outgoing?.map(({ targetRef }) => targetRef) || [];
                nextElements.push(...outgoing);

                nextElements?.forEach(nextEl => next(nextEl, dataOutputs));
            }

            availableDataMap = {};
            const root = moddleRoot.rootElements?.[0];
            if (root) {
                availableDataMap[root.id] = new Set();
                next(root);
            }
        }

        function check(node, reporter) {
            if (!availableDataMap)
                createMap(reporter.moddleRoot);

            if (!node.dataInputAssociations)
                return;

            node.dataInputAssociations.forEach(({ sourceRef }) => {
                const ref = sourceRef[0];
                if (!availableDataMap[node.id].has(ref)) {
                    reporter.report(
                        node.id,
                        `Eingabedaten "${ref.name || ref.id}" werden verwendet, bevor Daten darin gespeichert wurden`
                    );
                }
            });
        }

        return { check };
    }
});