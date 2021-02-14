import { is, traverseModdle } from './util';

import { DataModeEnum } from 'pflegebrille-workflow-meta-model';
import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';

export const noDataConsumedBeforeInitialized = () => ({
    category: RuleCategoryEnum.ERROR,
    factory(binding) {

        let availableDataMap;

        function createMap(moddleRoot) {

            const visited = new Set();

            function add(id, values) {
                let set = availableDataMap[id];
                if (!set) {
                    set = new Set();
                    availableDataMap[id] = set;
                }
                values?.forEach(set.add, set);
            }

            function next(el, newAvailableData) { // dfs
                if (visited.has(el.id)) // prevent circles
                    return;
                visited.add(el.id);

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

                const dataOutputs = [];
                if (is(el, 'bpmn:Activity')) {
                    traverseModdle(el, node => {
                        node.$descriptor?.properties?.forEach(p => {
                            if (
                                node[p.name]
                                && p.type === 'pb:Datum'
                                && p.meta.dataMode === DataModeEnum.OUTPUT
                            ) {
                                dataOutputs.push(node[p.name]);
                            }
                        });
                    });
                }

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
            if (!is(node, 'bpmn:Activity'))
                return;

            if (!availableDataMap)
                createMap(reporter.moddleRoot);

            console.log(availableDataMap)

            traverseModdle(node, innerNode => {
                innerNode.$descriptor?.properties?.forEach(p => {
                    const datum = innerNode[p.name];
                    if (
                        datum
                        && p.type === 'pb:Datum'
                        && p.meta.dataMode === DataModeEnum.INPUT
                        && availableDataMap[node.id]
                        && !availableDataMap[node.id].has(datum)
                    ) {
                        reporter.report(
                            node.id,
                            `Eingabedaten "${datum.name || datum.id}" werden verwendet, bevor Daten darin gespeichert wurden`
                        );
                    }
                });
            });
        }

        return { check };
    }
});