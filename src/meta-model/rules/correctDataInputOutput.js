import { DataTypeEnum, DataTypeLabels } from '../enum/DataTypeEnum';
import { findFieldBinding, findId, findLabel, findParent, is, isAny } from './util';

import { CardinalityEnum } from '../enum/CardinalityEnum';
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

                if (!refId) {
                    if (
                        dataCardinality !== CardinalityEnum.ZERO_TO_ONE
                        && dataCardinality !== CardinalityEnum.ZERO_TO_INFINITY
                    ) {
                        reporter.report(
                            findId(node),
                            `${getMsgStart(isInput, node, p.name)} hat unzulässige Kardinalität von 0`
                        );
                    }
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
                        && dataCardinality !== CardinalityEnum.ZERO_TO_INFINITY
                        && dataCardinality !== CardinalityEnum.ONE_TO_INFINITY
                    ) {
                        reporter.report(
                            findId(node),
                            `${getMsgStart(isInput, node, p.name)} hat unzulässige Kardinalität von unendlich`
                        );
                    }
                    // else: isCollection == false, indicates cardinality equals 1
                    // cardinality of 1 is allowed in all defined cardinalities
                    // and therefore must not be handled here

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