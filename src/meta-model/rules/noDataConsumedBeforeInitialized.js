import { is, traverseModdle } from './util';

import { DataModeEnum } from 'pflegebrille-workflow-meta-model';
import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';

export const noDataConsumedBeforeInitialized = () => ({
    category: RuleCategoryEnum.ERROR,
    factory(binding) {

        const cache = {};

        function getIncomingNodes(node) {
            const nextNodes = [];

            if (node.incoming?.length) {
                node.incoming?.forEach(({ sourceRef }) => {
                    nextNodes.push(
                        sourceRef.flowElements // SubProcess, ...
                            ? sourceRef.flowElements.find(el => is(el, 'bpmn:EndEvent'))
                            : sourceRef
                    );
                });
            } else if (is(node, 'bpmn:StartEvent') && node.$parent) {
                nextNodes.push(node.$parent);
            }

            return nextNodes;
        }

        // returns Set of Datum ids or null
        // traverses graph backwards and avoids cycles
        // returns available data AFTER node (after output)
        function getAvailableData(node, visited = new Set()) {
            if (!node?.id || visited.has(node.id))
                return null; // invalid path

            if (!cache[node.id]) {
                const nextNodes = getIncomingNodes(node);
                const set = new Set();

                // if no nextNodes, the graph ends here
                // because this path is valid and not invalid
                // we continue with initialising the cache with an empty set
                if (nextNodes.length) {
                    let data = null;
                    for (let nextNode of nextNodes) {
                        const nodeData = getAvailableData(nextNode, new Set([node.id, ...visited]));

                        if (!nodeData) // test if path is invalid
                            continue; // ignore invalid path (cycle)
                        else if (!data) // first (valid) incmoing path: take full data
                            data = new Set(nodeData);
                        else // for every other incoming path: use intersection of data
                            data = new Set([...data].filter(id => nodeData.has(id)));
                    }
                    // if data is null every incoming path is invalid
                    // therefore the current node cannot provide data to the caller
                    if (!data)
                        return null;
                    data.forEach(set.add, set);
                }

                cache[node.id] = set;

                // add own data output
                if (is(node, 'bpmn:Task')) {
                    traverseModdle(node, inner => {
                        inner.$descriptor?.properties?.forEach(p => {
                            if (
                                inner[p.name]
                                && p.type === 'pb:Datum'
                                && p.meta.dataMode === DataModeEnum.OUTPUT
                            ) {
                                set.add(inner[p.name].id);
                            }
                        });
                    });
                }
            }

            return cache[node.id];
        }

        // returns Set of Datum ids
        // returns available data BEFORE node (on input)
        function getAvailableInputData(node) {
            const incoming = getIncomingNodes(node);
            const set = new Set();
            for (let n of incoming) {
                const data = getAvailableData(n);
                data?.forEach(set.add, set);
            }
            return set;
        }

        function check(node, reporter) {
            if (!is(node, 'bpmn:Task'))
                return;

            traverseModdle(node, innerNode => {
                innerNode.$descriptor?.properties?.forEach(p => {
                    const datum = innerNode[p.name];
                    if (
                        datum
                        && p.type === 'pb:Datum'
                        && p.meta.dataMode === DataModeEnum.INPUT
                        && !getAvailableInputData(node).has(datum.id)
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