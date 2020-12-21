import { CardinalityEnum } from './enum/CardinalityEnum';
import { DataTypeEnum } from './enum/DataTypeEnum';
import { FormTypeEnum } from './enum/FormTypeEnum';
import { allowedElementTypes } from './rules/allowedElementTypes';
import { noMissingAssets } from './rules/noMissingAsset';
import { noUnusedAssets } from './rules/noUnusedAssets';
import { requiredAnyProperties } from './rules/requiredAnyProperties';
import { requiredProperties } from './rules/requiredProperties';

export const modelBindings = [
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
                'bpmn:Property',
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
            "bpmn:Definitions",
        ],
        extensions: [
            "pb:Assets"
        ]
    },
    {
        appliesTo: [
            "bpmn:ManualTask",
        ],
        extensions: [
            "pb:ManualTaskExtension"
        ]
    },
    {
        appliesTo: [
            "bpmn:ServiceTask",
        ],
        extensions: [
            "pb:ServiceTaskExtension"
        ]
    },
    {
        appliesTo: [
            "bpmn:UserTask",
        ],
        extensions: [
            "pb:UserTaskExtension"
        ]
    },
    {
        appliesTo: [
            "pb:ActivityExtension",
        ],
        rules: [
            requiredProperties(['function']),
        ]
    },
    {
        appliesTo: [
            "pb:ManualTaskExtension",
        ],
        fields: [
            {
                property: "function",
                type: FormTypeEnum.FUNCTION_SELECT,
                label: "Funktion",
                functionMap: {
                    "pb:MediaText": "Beschreibung / Medien anzeigen",
                }
            }
        ],
    },
    {
        appliesTo: [
            "pb:ServiceTaskExtension",
        ],
        fields: [
            {
                property: "function",
                type: FormTypeEnum.FUNCTION_SELECT,
                label: "Funktion",
                functionMap: {
                    "pb:ModifyDataCollection": "Datenobjekt bearbeiten (für mehrere Elemente)",
                    "pb:GetMedicationData": "[GET] Medikationen",
                    "pb:GetPatientData": "[GET] Patientendaten",
                    "pb:GetWoundHistory": "[GET] Wundverlauf",
                    "pb:GetDiagnosisHistory": "[GET] Diagnosen",
                    "pb:PostWoundData": "[POST] Wundinformationen",
                    "pb:PostWoundImage": "[POST] Wundbild",
                }
            }
        ],
    },
    {
        appliesTo: [
            "pb:UserTaskExtension",
        ],
        fields: [
            {
                property: "function",
                type: FormTypeEnum.FUNCTION_SELECT,
                label: "Funktion",
                functionMap: {
                    "pb:PainScale": "Schmerzwert abfragen",
                    "pb:WoundPicture": "Wundfoto aufnehmen",
                    "pb:WoundDetection": "Wunde vermessen",
                }
            }
        ],
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
            requiredAnyProperties(['text', 'mediaAssetRef'], false),
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
    {
        appliesTo: [
            "pb:ApiInputFunction",
        ],
        fields: [
            {
                property: "transactionInput",
                type: FormTypeEnum.DATA_INPUT,
                label: "Datenbanktransaktion",
                dataType: DataTypeEnum.DATABASE_TRANSACTION,
                dataCardinality: CardinalityEnum.ONE,
            },
        ]
    },
    {
        appliesTo: [
            "pb:ApiOutputFunction",
        ],
        fields: [
            {
                property: "transactionOutput",
                type: FormTypeEnum.DATA_OUTPUT,
                label: "Datenbanktransaktion",
                dataType: DataTypeEnum.DATABASE_TRANSACTION,
                dataCardinality: CardinalityEnum.ONE,
            },
        ]
    },
    {
        appliesTo: [
            "pb:PostWoundData",
        ],
        fields: [
            {
                property: "woundInformationInput",
                type: FormTypeEnum.DATA_INPUT,
                label: "Wundinformationen",
                dataType: DataTypeEnum.WOUND_INFORMATION,
                dataCardinality: CardinalityEnum.ONE,
            },
        ]
    }
]