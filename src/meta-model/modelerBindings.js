import { FormTypeEnum } from './enum/FormTypeEnum';
import { allowedElementTypes } from './rules/allowedElementTypes';
import { noMissingAssets } from './rules/noMissingAsset';
import { noMissingFunctionExtension } from './rules/noMissingFunctionExtension';
import { noUnusedAssets } from './rules/noUnusedAssets';
import { requiredAnyProperties } from './rules/requiredAnyProperties';
import { requiredProperties } from './rules/requiredProperties';

export const modelerBindings = [
    {
        // global rules
        appliesTo: [/.*/],
        rules: [
            allowedElementTypes([
                /^bpmndi:/,
                /^di:/,
                /^dc:/,
                /^pb:/,
                'bpmn:ManualTask',
                'bpmn:Definitions',
                'bpmn:SequenceFlow',
                'bpmn:UserTask',
                'bpmn:ServiceTask',
                'bpmn:SubProcess',
                'bpmn:StartEvent',
                'bpmn:EndEvent',
                'bpmn:ExtensionElements',
                'bpmn:DataAssociation',
                'bpmn:DataObjectReference',
                'bpmn:DataStoreReference',
                'bpmn:DataObject',
                'bpmn:Process',
                'bpmn:Category',
                'bpmn:Group',
                'bpmn:CategoryValue',
            ]),
            noUnusedAssets(),
            noMissingAssets(),
        ]
    },
    {
        appliesTo: [
            "bpmn:UserTask",
            "bpmn:ManualTask",
            "bpmn:ServiceTask",
        ],
        fields: [
            {
                property: "extensionElements",
                type: FormTypeEnum.EXTENSION_FUNCTION_SELECT,
                label: "Funktion"
            }
        ],
        rules: [
            noMissingFunctionExtension(),
        ]
    },
    {
        appliesTo: [
            "pb:MediaText"
        ],
        fields: [
            {
                property: "text",
                type: FormTypeEnum.MULTILINE_TEXT,
                label: "Textbeschreibung",
            },
            {
                property: "mediaAssetRef",
                type: FormTypeEnum.MEDIA_FILE,
                label: "Bild / Video",
            },
        ],
        rules: [
            requiredAnyProperties(['text', 'mediaAssetRef'], true),
            // todo asset defined rule
        ]
    },
    {
        appliesTo: [
            "bpmn:DataObject",
        ],
        fields: [
            {
                property: "isCollection",
                type: FormTypeEnum.CHECKBOX,
                label: "Kann mehrere Elemente speichern"
            },
        ]
    },
]