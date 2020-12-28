import { CardinalityEnum, CardinalityLabels } from '../enum/CardinalityEnum';
import { DataTypeEnum, DataTypeLabels } from '../enum/DataTypeEnum';
import { findFieldBinding, findId, findLabel, findParent, is, isAny } from './util';

import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';

export const correctDataInputOutput = () => ({
    category: RuleCategoryEnum.ERROR,
    factory(binding) {

        function getMsgStart(isInput, node, property) {
            return `${isInput ? 'Dateneingabe' : 'Datenausgabe'} "${findLabel(node, property)}"`;
        }

        function check(node, reporter) {
            if (!isAny(node, binding.appliesTo))
                return;

            const dataIoProps = node.$descriptor?.properties?.filter(({ type }) =>
                type === 'pb:DataInputRef' || type === 'pb:DataOutputRef');

            if (!dataIoProps?.length)
                return;

            const activity = findParent(node, 'bpmn:Activity');

            if (!activity)
                return;

            for (let p of dataIoProps) {
                const fieldBinding = findFieldBinding(node, field => field.property === p.name);
                if (!fieldBinding?.dataType)
                    continue;

                const isInput = (p.type === 'pb:DataInputRef');
                const { dataType, dataCardinality } = fieldBinding;
                const refId = node[p.name]?.refId;

                if (!refId) { // cardinality = 0
                    reporter.report(
                        findId(node),
                        `${getMsgStart(isInput, node, p.name)} fehlt`
                    );
                    continue;
                }

                let ref;
                if (isInput) {
                    ref = activity
                        ?.dataInputAssociations
                        ?.find(da => da.sourceRef[0]?.id === refId)
                        ?.sourceRef[0];
                } else {
                    ref = activity
                        ?.dataOutputAssociations
                        ?.find(da => da.targetRef?.id === refId)
                        ?.targetRef;
                }

                if (!ref) {
                    reporter.report(
                        findId(node),
                        `${getMsgStart(isInput, node, p.name)} referenziert nicht mehr assoziierte Daten`
                    );
                    continue;
                }

                if (is(ref, 'bpmn:DataObjectReference')) {

                    if (!ref.dataObjectRef) {
                        reporter.report(
                            findId(node),
                            `${getMsgStart(isInput, node, p.name)} referenziert Daten-Objekt, obwohl dieses nicht existiert; Anscheinend ist das BPMN-Element fehlerhaft`
                        );
                    }

                    const ext = ref
                        .dataObjectRef
                        .extensionElements
                        ?.values
                        ?.find(element => is(element, 'pb:DataObjectExtension'));

                    if (dataType !== ext?.dataType) {
                        reporter.report(
                            findId(node),
                            `${getMsgStart(isInput, node, p.name)} hat ungültigen Datentyp, erforderlich: "${DataTypeLabels[dataType]}"`
                        );
                    }

                    if (
                        ref.dataObjectRef.isCollection
                        && dataCardinality === CardinalityEnum.SINGLE
                    ) {
                        reporter.report(
                            findId(node),
                            `${getMsgStart(isInput, node, p.name)} hat unzulässige Kardinalität von "${CardinalityLabels[CardinalityEnum.MULTIPLE]}", benötigt "${CardinalityLabels[CardinalityEnum.SINGLE]}"`
                        );
                    }

                    if (
                        !ref.dataObjectRef.isCollection
                        && dataCardinality === CardinalityEnum.MULTIPLE
                    ) {
                        reporter.report(
                            findId(node),
                            `${getMsgStart(isInput, node, p.name)} hat unzulässige Kardinalität von "${CardinalityLabels[CardinalityEnum.SINGLE]}", benötigt "${CardinalityLabels[CardinalityEnum.MULTIPLE]}"`
                        );
                    }

                } else if (is(ref, 'bpmn:DataStoreReference')) {

                    if (dataType !== DataTypeEnum.DATABASE_TRANSACTION) {
                        reporter.report(
                            findId(node),
                            `${getMsgStart(isInput, node, p.name)} hat ungültigen Datentyp, erforderlich: "${DataTypeLabels[dataType]}"`
                        );
                    }

                } else {

                    reporter.report(
                        findId(node),
                        `${getMsgStart(isInput, node, p.name)} referenziert unzulässiges BPMN Element`
                    );

                }
            }
        }

        return { check };
    }
});