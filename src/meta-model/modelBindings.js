import { CardinalityEnum } from './enum/CardinalityEnum';
import { DataTypeEnum } from './enum/DataTypeEnum';
import { FormTypeEnum } from './enum/FormTypeEnum';
import { allowedElementTypes } from './rules/allowedElementTypes';
import { correctDataInputOutput } from './rules/correctDataInputOutput';
import { labelRequired } from './rules/labelRequired';
import { labelRequiredOnForking } from './rules/labelRequiredOnForking';
import { noMissingAssets } from './rules/noMissingAsset';
import { noMissingDataType } from './rules/noMissingDataType';
import { noUnusedAssets } from './rules/noUnusedAssets';
import { requiredAnyProperties } from './rules/requiredAnyProperties';
import { requiredProperties } from './rules/requiredProperties';

// order of fields dictate visual order in properties panel
// DO NOT overwrite properties, rules do not respect inheritance order
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
                'bpmn:ExclusiveGateway',
            ]),
            labelRequiredOnForking(),
            noUnusedAssets(),
            noMissingAssets(),
            noMissingDataType(),
            correctDataInputOutput(),
        ]
    },
    {
        appliesTo: [
            'bpmn:ManualTask',
            'bpmn:UserTask',
            'bpmn:ServiceTask',
            'bpmn:DataObjectReference',
            'bpmn:DataStoreReference',
        ],
        rules: [
            labelRequired(),
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
            "bpmn:DataObject",
        ],
        fields: [
            {
                property: "isCollection",
                type: FormTypeEnum.CHECKBOX,
                label: "Kann mehrere Elemente speichern"
            },
        ],
        extensions: [
            "pb:DataObjectExtension"
        ]
    },
    {
        appliesTo: [
            "pb:DataObjectExtension",
        ],
        fields: [
            {
                property: "dataType",
                type: FormTypeEnum.DATA_TYPE_SELECT,
                label: "Datentyp"
            },
        ],
    },
    {
        appliesTo: [
            "bpmn:ManualTask",
        ],
        extensions: [
            "pb:MediaText"
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
            "pb:ServiceTaskExtension",
        ],
        fields: [
            {
                property: "function",
                type: FormTypeEnum.FUNCTION_SELECT,
                label: "Funktion",
                functionOptions: [
                    {
                        group: "Lokale Datenobjekte bearbeiten",
                        options: [
                            { type: "pb:ModifyDataCollection", label: "Datenobjekt bearbeiten (für mehrere Elemente)" }
                        ]
                    },
                    {
                        group: "Daten abfragen",
                        options: [
                            { type: "pb:GetMedicationData", label: "[GET] Medikationen" },
                            { type: "pb:GetPatientData", label: "[GET] Patientendaten" },
                            { type: "pb:GetWoundHistory", label: "[GET] Wundverlauf" },
                            { type: "pb:GetDiagnosisHistory", label: "[GET] Diagnosen" },
                        ]
                    },
                    {
                        group: "Daten senden",
                        options: [
                            { type: "pb:PostWoundData", label: "[POST] Wundinformationen" },
                            { type: "pb:PostWoundImage", label: "[POST] Wundbild" },
                        ]
                    }
                ]
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
                functionOptions: [
                    { type: "pb:PainScale", label: "Schmerzwert abfragen" },
                    { type: "pb:WoundPicture", label: "Wundfoto aufnehmen" },
                    { type: "pb:WoundDetection", label: "Wunde vermessen" },
                ]
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
            "pb:ApiInputFunction",
        ],
        fields: [
            {
                property: "transactionInput",
                type: FormTypeEnum.DATA_INPUT_SELECT,
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
                type: FormTypeEnum.DATA_OUTPUT_SELECT,
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
                type: FormTypeEnum.DATA_INPUT_SELECT,
                label: "Wundinformationen",
                dataType: DataTypeEnum.WOUND_DATA,
                dataCardinality: CardinalityEnum.ONE,
            },
        ]
    }
]