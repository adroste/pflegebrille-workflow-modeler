import { DataTypeEnum, DataTypeLabels } from './enum/DataTypeEnum';

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
                            { value: "pb:ModifyDataCollection", label: "Datenobjekt bearbeiten (für mehrere Elemente)" }
                        ]
                    },
                    {
                        group: "Daten abfragen",
                        options: [
                            { value: "pb:GetMedicationHistory", label: "[GET] Medikationsverlauf" },
                            { value: "pb:GetPatientData", label: "[GET] Patientendaten" },
                            { value: "pb:GetWoundHistory", label: "[GET] Wundverlauf" },
                            { value: "pb:GetDiagnosisHistory", label: "[GET] Diagnosen" },
                        ]
                    },
                    {
                        group: "Daten senden",
                        options: [
                            { value: "pb:PostWoundData", label: "[POST] Wunddaten" },
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
            "pb:ApiInputFunction",
        ],
        fields: [
            {
                property: "transactionInput",
                type: FormTypeEnum.DATA_INPUT_SELECT,
                label: "Datenbanktransaktion",
                dataType: DataTypeEnum.DATABASE_TRANSACTION,
                dataCardinality: CardinalityEnum.SINGLE,
            },
        ]
    },
    {
        appliesTo: [
            "pb:PatientContextFunction",
        ],
        fields: [
            {
                property: "patientRefInput",
                type: FormTypeEnum.DATA_INPUT_SELECT,
                label: "Patient (Referenz/ID)",
                dataType: DataTypeEnum.PATIENT_REF,
                dataCardinality: CardinalityEnum.SINGLE,
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
                property: "patientRefOutput",
                type: FormTypeEnum.DATA_OUTPUT_SELECT,
                label: "Patient (Referenz/ID)",
                dataType: DataTypeEnum.PATIENT_REF,
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
                property: "woundDataOutput",
                type: FormTypeEnum.DATA_OUTPUT_SELECT,
                label: "Erkannte Wunddaten",
                dataType: DataTypeEnum.WOUND_DATA,
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
                property: "woundHistoryInput",
                type: FormTypeEnum.DATA_INPUT_SELECT,
                label: "Wundverlauf",
                dataType: DataTypeEnum.WOUND_DATA,
                dataCardinality: CardinalityEnum.MULTIPLE,
            },
            {
                property: "woundDataOutput",
                type: FormTypeEnum.DATA_OUTPUT_SELECT,
                label: "Wunddaten",
                dataType: DataTypeEnum.WOUND_DATA,
                dataCardinality: CardinalityEnum.SINGLE,
            },
        ]
    },
    /**
     * For ServiceTask
     */
    {
        appliesTo: [
            "pb:GetDiagnosisHistory",
        ],
        fields: [
            {
                property: "diagnosisHistoryOutput",
                type: FormTypeEnum.DATA_OUTPUT_SELECT,
                label: "Diagnosenverlauf",
                dataType: DataTypeEnum.DIAGNOSIS_DATA,
                dataCardinality: CardinalityEnum.MULTIPLE,
            },
        ]
    },
    {
        appliesTo: [
            "pb:GetMedicationHistory",
        ],
        fields: [
            {
                property: "medicationHistoryOutput",
                type: FormTypeEnum.DATA_OUTPUT_SELECT,
                label: "Medikationsverlauf",
                dataType: DataTypeEnum.MEDICATION_DATA,
                dataCardinality: CardinalityEnum.MULTIPLE,
            },
        ]
    },
    {
        appliesTo: [
            "pb:GetPatientData",
        ],
        fields: [
            {
                property: "patientDataOutput",
                type: FormTypeEnum.DATA_OUTPUT_SELECT,
                label: "Patientendaten",
                dataType: DataTypeEnum.PATIENT_DATA,
                dataCardinality: CardinalityEnum.SINGLE,
            },
        ]
    },
    {
        appliesTo: [
            "pb:GetWoundHistory",
        ],
        fields: [
            {
                property: "woundHistoryOutput",
                type: FormTypeEnum.DATA_OUTPUT_SELECT,
                label: "Wundverlauf",
                dataType: DataTypeEnum.WOUND_DATA,
                dataCardinality: CardinalityEnum.MULTIPLE,
            },
        ]
    },
    {
        appliesTo: [
            "pb:PostWoundData",
        ],
        fields: [
            {
                property: "woundDataInput",
                type: FormTypeEnum.DATA_INPUT_SELECT,
                label: "Wunddaten",
                dataType: DataTypeEnum.WOUND_DATA,
                dataCardinality: CardinalityEnum.SINGLE,
            },
        ]
    },
    {
        appliesTo: [
            "pb:PostWoundImage",
        ],
        fields: [
            {
                property: "woundImageInput",
                type: FormTypeEnum.DATA_INPUT_SELECT,
                label: "Wundfoto",
                dataType: DataTypeEnum.IMAGE,
                dataCardinality: CardinalityEnum.SINGLE,
            },
        ]
    }
]