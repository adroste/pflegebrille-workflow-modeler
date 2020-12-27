import { DataTypeEnum, DataTypeLabels } from './enum/DataTypeEnum';

import { CardinalityEnum } from './enum/CardinalityEnum';
import { FormTypeEnum } from './enum/FormTypeEnum';
import { allowedElementTypes } from './rules/allowedElementTypes';
import { correctDataInputOutput } from './rules/correctDataInputOutput';
import { endEventRequired } from './rules/endEventRequired';
import { enumToSelectOptions } from './util';
import { labelRequired } from './rules/labelRequired';
import { labelRequiredOnForking } from './rules/labelRequiredOnForking';
import { noDisconnected } from './rules/noDisconnected';
import { noFakeJoin } from './rules/noFakeJoin';
import { noMissingAssets } from './rules/noMissingAsset';
import { noMissingDataType } from './rules/noMissingDataType';
import { noUnusedAssets } from './rules/noUnusedAssets';
import { noUnusedDataInputOutput } from './rules/noUnusedDataInputOutput';
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
                'bpmn:Association',
                'bpmn:TextAnnotation',
            ]),
            labelRequiredOnForking(),
            noUnusedAssets(),
            noMissingAssets(),
            noMissingDataType(),
            correctDataInputOutput(),
            noUnusedDataInputOutput(),
            endEventRequired(),
        ]
    },
    {
        appliesTo: [
            'bpmn:Event',
            'bpmn:Task',
        ],
        rules: [
            noFakeJoin(),
        ]
    },
    {
        appliesTo: [
            'bpmn:Event',
            'bpmn:Gateway',
            'bpmn:SubProcess',
            'bpmn:Task',
        ],
        rules: [
            noDisconnected(),
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
            "bpmn:TextAnnotation"
        ],
        fields: [
            // do not show this property in properties panel
            // as auto size feature do not work this way without furhter handling
            {
                property: "text",
                type: null, // null = do not show in properties panel
                label: "Text",
            },
        ],
        rules: [
            requiredAnyProperties(['text'], false),
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
                type: FormTypeEnum.SELECT,
                label: "Datentyp",
                selectPlaceholder: "Datentyp wählen...",
                selectOptions: enumToSelectOptions(DataTypeEnum, DataTypeLabels),
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
                type: FormTypeEnum.EXTENSION_SELECT,
                label: "Funktion",
                selectPlaceholder: "Funktion wählen...",
                selectOptions: [
                    {
                        group: "Lokale Datenobjekte bearbeiten",
                        options: [
                            { value: "pb:ModifyDataCollection", label: "Datenobjekt bearbeiten (für mehrere Elemente)" }
                        ]
                    },
                    {
                        group: "Daten abfragen",
                        options: [
                            { value: "pb:GetMedicationData", label: "[GET] Medikationen" },
                            { value: "pb:GetPatientData", label: "[GET] Patientendaten" },
                            { value: "pb:GetWoundHistory", label: "[GET] Wundverlauf" },
                            { value: "pb:GetDiagnosisHistory", label: "[GET] Diagnosen" },
                        ]
                    },
                    {
                        group: "Daten senden",
                        options: [
                            { value: "pb:PostWoundData", label: "[POST] Wundinformationen" },
                            { value: "pb:PostWoundImage", label: "[POST] Wundbild" },
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
                type: FormTypeEnum.EXTENSION_SELECT,
                label: "Funktion",
                selectPlaceholder: "Funktion wählen...",
                selectOptions: [
                    { value: "pb:PainScale", label: "Schmerzwert abfragen" },
                    { value: "pb:WoundPicture", label: "Wundfoto aufnehmen" },
                    { value: "pb:WoundDetection", label: "Wunde vermessen" },
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