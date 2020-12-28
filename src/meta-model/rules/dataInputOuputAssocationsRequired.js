import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';
import { is } from './util';

export const dataInputOuputAssocationsRequired = () => ({
    category: RuleCategoryEnum.ERROR,
    factory(binding) {

        const dataInputAssociations = [];
        const dataOutputAssociations = [];
        const dataObjectReferences = [];

        function afterCheck(node, reporter) {
            dataObjectReferences.forEach(({ id }) => {
                const receivesInput = dataInputAssociations.some(
                    ({ sourceRef }) => sourceRef[0]?.id === id);

                const receivesOutput = dataOutputAssociations.some(
                    ({ targetRef }) => targetRef?.id === id);
                
                if (!receivesInput)
                    reporter.report(
                        id,
                        'Ausgehende Dateneingabeassoziation fehlt'
                    );

                if (!receivesOutput)
                    reporter.report(
                        id,
                        'Eingehende Datenausgabeassoziation fehlt'
                    );
            });
        }

        function check(node, reporter) {
            if (is(node, 'bpmn:DataInputAssociation')) {
                dataInputAssociations.push(node);
            } else if (is(node, 'bpmn:DataOutputAssociation')) {
                dataOutputAssociations.push(node);
            } else if (is(node, 'bpmn:DataObjectReference')) {
                dataObjectReferences.push(node);
            }
        }

        return { check, afterCheck };
    }
});