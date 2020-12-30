import { DataTypeEnum, DataTypeLabels } from './enum/DataTypeEnum';
import { ElementPositionEnum, ElementPositionLabels } from './enum/ElementPositionEnum';

import { CardinalityEnum } from './enum/CardinalityEnum';
import { FormTypeEnum } from './enum/FormTypeEnum';
import { allowedElementTypes } from './rules/allowedElementTypes';
import { correctDataInputOutput } from './rules/correctDataInputOutput';
import { dataInputOuputAssocationsRequired } from './rules/dataInputOuputAssocationsRequired';
import { endEventRequired } from './rules/endEventRequired';
import { enumToSelectOptions } from './util';
import { incomingFlowRequired } from './rules/incomingFlowRequired';
import { labelRequired } from './rules/labelRequired';
import { labelRequiredOnForking } from './rules/labelRequiredOnForking';
import { noDisconnected } from './rules/noDisconnected';
import { noDuplicateSequenceFlows } from './rules/noDuplicateSequenceFlows';
import { noFakeFork } from './rules/noFakeFork';
import { noFakeJoin } from './rules/noFakeJoin';
import { noJoinAndFork } from './rules/noJoinAndFork';
import { noMissingAssets } from './rules/noMissingAsset';
import { noMissingDataType } from './rules/noMissingDataType';
import { noUnusedAssets } from './rules/noUnusedAssets';
import { noUnusedDataInputOutput } from './rules/noUnusedDataInputOutput';
import { outgoingFlowRequired } from './rules/outgoingFlowRequired';
import { requiredAnyProperties } from './rules/requiredAnyProperties';
import { requiredProperties } from './rules/requiredProperties';
import { sameDataTypeProperties } from './rules/sameDataTypeProperties';
import { singleBlankStartEventRequired } from './rules/singleBlankStartEventRequired';
import { startEventRequired } from './rules/startEventRequired';
import { superfluousGateway } from './rules/superfluousGateway';

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
            correctDataInputOutput(),
            dataInputOuputAssocationsRequired(),
            endEventRequired(),
            labelRequiredOnForking(),
            noDuplicateSequenceFlows(),
            noMissingAssets(),
            noMissingDataType(),
            noUnusedAssets(),
            noUnusedDataInputOutput(),
            singleBlankStartEventRequired(),
            startEventRequired(),
            superfluousGateway(),
        ]
    },
    {
        appliesTo: [
            'bpmn:Event',
            'bpmn:Task',
        ],
        rules: [
            noFakeJoin(),
            noFakeFork(),
        ]
    },
    {
        appliesTo: [
            'bpmn:Gateway',
        ],
        rules: [
            noJoinAndFork(),
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
            'bpmn:StartEvent',
            'bpmn:Gateway',
            'bpmn:SubProcess',
            'bpmn:Task',
        ],
        rules: [
            outgoingFlowRequired(),
        ]
    },
    {
        appliesTo: [
            'bpmn:EndEvent',
            'bpmn:Gateway',
            'bpmn:SubProcess',
            'bpmn:Task',
        ],
        rules: [
            incomingFlowRequired(),
        ]
    },
    {
        appliesTo: [
            'bpmn:ManualTask',
            'bpmn:UserTask',
            'bpmn:ServiceTask',
            'bpmn:DataObjectReference',
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
                selectOptions: enumToSelectOptions(DataTypeEnum, DataTypeLabels, [DataTypeEnum.ANY]),
            },
        ],
    },
    /**
     * Tasks: General
     */
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
                            { value: "pb:ConcatData", label: "Daten konkatenieren" },
                            { value: "pb:DeleteDataFromCollection", label: "Element aus Menge entfernen" },
                            { value: "pb:SelectDataFromCollection", label: "Element aus Menge auswählen" },
                        ]
                    },
                    // {
                    //     group: "Daten abfragen",
                    //     options: [
                    //         { value: "pb:GetMedicationHistory", label: "[GET] Medikationsverlauf" },
                    //         { value: "pb:GetPatientData", label: "[GET] Patientendaten" },
                    //         { value: "pb:GetWoundHistory", label: "[GET] Wundverlauf" },
                    //         { value: "pb:GetDiagnosisHistory", label: "[GET] Diagnosen" },
                    //     ]
                    // },
                    {
                        group: "Daten anlegen",
                        options: [
                            { value: "pb:CreateWoundHistoryEntry", label: "Wundverlaufseintrag anlegen" },
                        ]
                    },
                    {
                        group: "Daten senden",
                        options: [
                            { value: "pb:PostWoundHistoryEntry", label: "Wundverlaufseintrag senden" },
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
                    { value: "pb:PatientSelect", label: "Patient einlesen/auswählen" },
                    { value: "pb:WoundDetection", label: "Wunde erkennen/vermessen" },
                    { value: "pb:WoundPicture", label: "Wundfoto aufnehmen" },
                    { value: "pb:WoundSelect", label: "Wunde auswählen" },
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
            "pb:PatientContextFunction",
        ],
        fields: [
            {
                property: "patientInput",
                type: FormTypeEnum.DATA_INPUT_SELECT,
                label: "Patient",
                dataType: DataTypeEnum.PATIENT,
                dataCardinality: CardinalityEnum.SINGLE,
            },
        ]
    },
    {
        appliesTo: [
            "pb:WoundContextFunction",
        ],
        fields: [
            {
                property: "woundInput",
                type: FormTypeEnum.DATA_INPUT_SELECT,
                label: "Wunde",
                dataType: DataTypeEnum.WOUND,
                dataCardinality: CardinalityEnum.SINGLE,
            },
        ]
    },
    /**
     * For UserTask
     */
    {
        appliesTo: [
            "pb:PainScale",
        ],
        fields: [
            {
                property: "painValueOutput",
                type: FormTypeEnum.DATA_OUTPUT_SELECT,
                label: "Schmerzwert",
                dataType: DataTypeEnum.NUMERIC_VALUE,
                dataCardinality: CardinalityEnum.SINGLE,
            },
        ]
    },
    {
        appliesTo: [
            "pb:PatientSelect",
        ],
        fields: [
            {
                property: "patientOutput",
                type: FormTypeEnum.DATA_OUTPUT_SELECT,
                label: "Patient",
                dataType: DataTypeEnum.PATIENT,
                dataCardinality: CardinalityEnum.SINGLE,
            },
        ]
    },
    {
        appliesTo: [
            "pb:WoundDetection",
        ],
        fields: [
            {
                property: "woundPictureInput",
                type: FormTypeEnum.DATA_INPUT_SELECT,
                label: "Wundfoto (zur Erkennung)",
                dataType: DataTypeEnum.IMAGE,
                dataCardinality: CardinalityEnum.SINGLE,
            },
            {
                property: "woundMeasurementOutput",
                type: FormTypeEnum.DATA_OUTPUT_SELECT,
                label: "Wundmaße",
                dataType: DataTypeEnum.WOUND_MEASUREMENT,
                dataCardinality: CardinalityEnum.SINGLE,
            },
        ]
    },
    {
        appliesTo: [
            "pb:WoundPicture",
        ],
        fields: [
            {
                property: "woundPictureOutput",
                type: FormTypeEnum.DATA_OUTPUT_SELECT,
                label: "Wundfoto",
                dataType: DataTypeEnum.IMAGE,
                dataCardinality: CardinalityEnum.SINGLE,
            },
        ]
    },
    {
        appliesTo: [
            "pb:WoundSelect",
        ],
        fields: [
            {
                property: "woundOutput",
                type: FormTypeEnum.DATA_OUTPUT_SELECT,
                label: "Ausgewählte Wunde",
                dataType: DataTypeEnum.WOUND,
                dataCardinality: CardinalityEnum.SINGLE,
            },
        ]
    },
    /**
     * For ServiceTask
     */
    {
        appliesTo: [
            "pb:ConcatData",
        ],
        fields: [
            {
                property: "firstInput",
                type: FormTypeEnum.DATA_INPUT_SELECT,
                label: "1. Eingabedaten",
                dataType: DataTypeEnum.ANY,
                dataCardinality: CardinalityEnum.ANY,
            },
            {
                property: "secondInput",
                type: FormTypeEnum.DATA_INPUT_SELECT,
                label: "2. Eingabedaten",
                dataType: DataTypeEnum.ANY,
                dataCardinality: CardinalityEnum.ANY,
            },
            {
                property: "collectionOutput",
                type: FormTypeEnum.DATA_OUTPUT_SELECT,
                label: "Konkatenierte Daten",
                dataType: DataTypeEnum.ANY,
                dataCardinality: CardinalityEnum.MULTIPLE,
            },
        ],
        rules: [
            sameDataTypeProperties(['firstInput', 'secondInput', 'collectionOutput']),
        ]
    },
    {
        appliesTo: [
            "pb:DeleteDataFromCollection",
            "pb:SelectDataFromCollection",
        ],
        fields: [
            {
                property: "position",
                type: FormTypeEnum.SELECT,
                label: "Elementposition",
                selectPlaceholder: "Elementposition wählen...",
                selectOptions: enumToSelectOptions(ElementPositionEnum, ElementPositionLabels),
            },
        ],
        rules: [
            requiredProperties(['position']),
        ]
    },
    {
        appliesTo: [
            "pb:DeleteDataFromCollection",
        ],
        fields: [
            {
                property: "collectionInput",
                type: FormTypeEnum.DATA_INPUT_SELECT,
                label: "Eingabedaten",
                dataType: DataTypeEnum.ANY,
                dataCardinality: CardinalityEnum.MULTIPLE,
            },
            {
                property: "collectionOutput",
                type: FormTypeEnum.DATA_OUTPUT_SELECT,
                label: "Ausgabedaten",
                dataType: DataTypeEnum.ANY,
                dataCardinality: CardinalityEnum.MULTIPLE,
            },
        ],
        rules: [
            sameDataTypeProperties(['collectionInput', 'collectionOutput']),
        ]
    },
    {
        appliesTo: [
            "pb:SelectDataFromCollection",
        ],
        fields: [
            {
                property: "collectionInput",
                type: FormTypeEnum.DATA_INPUT_SELECT,
                label: "Eingabedaten",
                dataType: DataTypeEnum.ANY,
                dataCardinality: CardinalityEnum.MULTIPLE,
            },
            {
                property: "dataOutput",
                type: FormTypeEnum.DATA_OUTPUT_SELECT,
                label: "Ausgabedaten",
                dataType: DataTypeEnum.ANY,
                dataCardinality: CardinalityEnum.SINGLE,
            },
        ],
        rules: [
            sameDataTypeProperties(['collectionInput', 'dataOutput']),
        ]
    },
    // {
    //     appliesTo: [
    //         "pb:GetDiagnosisHistory",
    //     ],
    //     fields: [
    //         {
    //             property: "diagnosisHistoryOutput",
    //             type: FormTypeEnum.DATA_OUTPUT_SELECT,
    //             label: "Diagnosenverlauf",
    //             dataType: DataTypeEnum.DIAGNOSIS_DATA,
    //             dataCardinality: CardinalityEnum.MULTIPLE,
    //         },
    //     ]
    // },
    // {
    //     appliesTo: [
    //         "pb:GetMedicationHistory",
    //     ],
    //     fields: [
    //         {
    //             property: "medicationHistoryOutput",
    //             type: FormTypeEnum.DATA_OUTPUT_SELECT,
    //             label: "Medikationsverlauf",
    //             dataType: DataTypeEnum.MEDICATION_DATA,
    //             dataCardinality: CardinalityEnum.MULTIPLE,
    //         },
    //     ]
    // },
    {
        appliesTo: [
            "pb:PostWoundHistoryEntry",
        ],
        fields: [
            {
                property: "woundHistoryEntryInput",
                type: FormTypeEnum.DATA_INPUT_SELECT,
                label: "Wundverlaufseintrag",
                dataType: DataTypeEnum.WOUND_HISTORY_ENTRY,
                dataCardinality: CardinalityEnum.SINGLE,
            },
        ]
    },
    {
        appliesTo: [
            "pb:CreateWoundHistoryEntry",
        ],
        fields: [
            {
                property: "woundHistoryEntryOutput",
                type: FormTypeEnum.DATA_OUTPUT_SELECT,
                label: "Wundverlaufseintrag",
                dataType: DataTypeEnum.WOUND_HISTORY_ENTRY,
                dataCardinality: CardinalityEnum.SINGLE,
            },
            {
                // todo optional
                property: "woundImageInput",
                type: FormTypeEnum.DATA_INPUT_SELECT,
                label: "Wundfoto(s)",
                dataType: DataTypeEnum.IMAGE,
                dataCardinality: CardinalityEnum.ANY,
            },
            {
                property: "woundMeasurementInput",
                type: FormTypeEnum.DATA_INPUT_SELECT,
                label: "Wundmaße",
                dataType: DataTypeEnum.WOUND_MEASUREMENT,
                dataCardinality: CardinalityEnum.SINGLE,
            },
        ]
    }
]