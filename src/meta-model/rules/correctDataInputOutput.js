import { CardinalityEnum, DataModeEnum } from 'pflegebrille-workflow-meta-model';
import { findId, findLabel, findParent, isAny } from './util';

import { CardinalityLabels } from '../enum/CardinalityLabels';
import { DataTypeEnum } from 'pflegebrille-workflow-meta-model';
import { DataTypeLabels } from '../enum/DataTypeLabels';
import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';

export const correctDataInputOutput = () => ({
    category: RuleCategoryEnum.ERROR,
    factory(binding, modelBindings) {

        function getMsgStart(isInput, node, property) {
            return `${isInput ? 'Dateneingabe' : 'Datenausgabe'} "${findLabel(modelBindings, node, property)}"`;
        }

        function check(node, reporter) {
            if (!isAny(node, binding.appliesTo))
                return;

            const dataIoProps = node.$descriptor?.properties?.filter(({ type }) => type === 'pb:Datum');

            if (!dataIoProps?.length)
                return;

            const activity = findParent(node, 'bpmn:Task');

            if (!activity)
                return;

            for (let p of dataIoProps) {
                const { dataMode, dataType, dataCardinality, dataOptional } = p.meta;
                const isInput = dataMode === DataModeEnum.INPUT;
                const datum = node[p.name];

                if (!datum) { // cardinality = 0
                    if (!dataOptional) {
                        reporter.report(
                            findId(node),
                            `${getMsgStart(isInput, node, p.name)} fehlt`
                        );
                    }
                    continue;
                }

                if (dataType !== DataTypeEnum.ANY && dataType !== datum.type) {
                    reporter.report(
                        findId(node),
                        `${getMsgStart(isInput, node, p.name)} hat ungültigen Datentyp, erforderlich: "${DataTypeLabels[dataType]}"`
                    );
                }

                if (datum.isCollection && dataCardinality === CardinalityEnum.SINGLE) {
                    reporter.report(
                        findId(node),
                        `${getMsgStart(isInput, node, p.name)} hat unzulässige Kardinalität von "${CardinalityLabels[CardinalityEnum.MULTIPLE]}", benötigt "${CardinalityLabels[CardinalityEnum.SINGLE]}"`
                    );
                }

                if (!datum.isCollection && dataCardinality === CardinalityEnum.MULTIPLE) {
                    reporter.report(
                        findId(node),
                        `${getMsgStart(isInput, node, p.name)} hat unzulässige Kardinalität von "${CardinalityLabels[CardinalityEnum.SINGLE]}", benötigt "${CardinalityLabels[CardinalityEnum.MULTIPLE]}"`
                    );
                }
            }
        }

        return { check };
    }
});