import { RuleCategoryEnum } from '../enum/RuleCategoryEnum';
import { is } from './util';

export const dataInputOuputAssocationsRequired = () => ({
    category: RuleCategoryEnum.ERROR,
    factory(binding) {

        const dataInputAssociations = [];
        const dataOutputAssociations = [];
        const dataObjectReferences = [];

        function leave(node, reporter) {
            if (!is(node, 'bpmn:Definitions'))
                return;

            dataObjectReferences.forEach(({ id }) => {
                const receivesInput = dataInputAssociations.some(
                    ({ sourceRef }) => sourceRef[0]?.id === id);

                const receivesOutput = dataOutputAssociations.some(
                    ({ targetRef }) => targetRef?.id === id);
                
                if (!receivesInput)
                    reporter.report(
                        id,
                        'Ausgehende Datenassoziation fehlt'
                    );

                if (!receivesOutput)
                    reporter.report(
                        id,
                        'Eingehende Datenassoziation fehlt'
                    );
            });
        }

        function enter(node, reporter) {
            if (is(node, 'bpmn:DataInputAssociation')) {
                dataInputAssociations.push(node);
            } else if (is(node, 'bpmn:DataOutputAssociation')) {
                dataOutputAssociations.push(node);
            } else if (is(node, 'bpmn:DataObjectReference')) {
                dataObjectReferences.push(node);
            }
        }

        return { check: { enter, leave } };
    }
});