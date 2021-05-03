import { DataTypeEnum, ElementPositionEnum } from 'pflegebrille-workflow-meta-model';

import { DataTypeLabels } from './enum/DataTypeLabels';
import { ElementPositionLabels } from './enum/ElementPositionLabels';
import { FormTypeEnum } from './enum/FormTypeEnum';
import { allowedElementTypes } from './rules/allowedElementTypes';
import { correctDataInputOutput } from './rules/correctDataInputOutput';
import { endEventRequired } from './rules/endEventRequired';
import { enumToSelectOptions } from './util';
import { incomingFlowRequired } from './rules/incomingFlowRequired';
import { labelRequired } from './rules/labelRequired';
import { labelRequiredOnForking } from './rules/labelRequiredOnForking';
import { noDataConsumedBeforeInitialized } from './rules/noDataConsumedBeforeInitialized';
import { noDisconnected } from './rules/noDisconnected';
import { noDuplicateSequenceFlows } from './rules/noDuplicateSequenceFlows';
import { noFakeFork } from './rules/noFakeFork';
import { noFakeJoin } from './rules/noFakeJoin';
import { noJoinAndFork } from './rules/noJoinAndFork';
import { noMissingAssets } from './rules/noMissingAssets';
import { noUnusedAssets } from './rules/noUnusedAssets';
import { noUnusedData } from './rules/noUnusedData';
import { onlyOnce } from './rules/onlyOnce';
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
                'bpmn:Association',
                'bpmn:Category',
                'bpmn:CategoryValue',
                'bpmn:Definitions',
                'bpmn:EndEvent',
                'bpmn:ExclusiveGateway',
                'bpmn:ExtensionElements',
                'bpmn:Group',
                'bpmn:ManualTask',
                'bpmn:Process',
                'bpmn:Property',
                'bpmn:SequenceFlow',
                'bpmn:ServiceTask',
                'bpmn:StartEvent',
                'bpmn:SubProcess',
                'bpmn:TextAnnotation',
                'bpmn:UserTask',
            ]),
            correctDataInputOutput(),
            noDataConsumedBeforeInitialized(),
            endEventRequired(),
            labelRequiredOnForking(),
            noDuplicateSequenceFlows(),
            noMissingAssets(),
            noUnusedAssets(),
            noUnusedData(),
            singleBlankStartEventRequired(),
            startEventRequired(),
            superfluousGateway(),
        ]
    },
    {
        appliesTo: [
            'bpmn:Event',
            'bpmn:Task',
            'bpmn:SubProcess',
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
            "pb:ServiceTaskExtension",
            "pb:UserTaskExtension",
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
                type: FormTypeEnum.DATUM_SELECT,
                label: "Patient",
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
                type: FormTypeEnum.DATUM_SELECT,
                label: "Wunde",
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
                type: FormTypeEnum.DATUM_SELECT,
                label: "Schmerzwert",
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
                type: FormTypeEnum.DATUM_SELECT,
                label: "Patient",
            },
        ],
        rules: [
            onlyOnce(),
        ]
    },
    {
        appliesTo: [
            "pb:WoundDetection",
        ],
        fields: [
            {
                property: "woundPictureInput",
                type: FormTypeEnum.DATUM_SELECT,
                label: "Wundfoto (zur Erkennung)",
            },
            {
                property: "woundMeasurementOutput",
                type: FormTypeEnum.DATUM_SELECT,
                label: "Wundmaße",
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
                type: FormTypeEnum.DATUM_SELECT,
                label: "Wundfoto",
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
                type: FormTypeEnum.DATUM_SELECT,
                label: "Ausgewählte Wunde",
            },
        ],
        rules: [
            onlyOnce(),
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
                type: FormTypeEnum.DATUM_SELECT,
                label: "1. Eingabedaten",
            },
            {
                property: "secondInput",
                type: FormTypeEnum.DATUM_SELECT,
                label: "2. Eingabedaten",
            },
            {
                property: "collectionOutput",
                type: FormTypeEnum.DATUM_SELECT,
                label: "Konkatenierte Daten",
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
                type: FormTypeEnum.DATUM_SELECT,
                label: "Eingabedaten",
            },
            {
                property: "collectionOutput",
                type: FormTypeEnum.DATUM_SELECT,
                label: "Ausgabedaten",
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
                type: FormTypeEnum.DATUM_SELECT,
                label: "Eingabedaten",
            },
            {
                property: "dataOutput",
                type: FormTypeEnum.DATUM_SELECT,
                label: "Ausgabedaten",
            },
        ],
        rules: [
            sameDataTypeProperties(['collectionInput', 'dataOutput']),
        ]
    },
    {
        appliesTo: [
            "pb:PostWoundHistoryEntry",
        ],
        fields: [
            {
                property: "woundHistoryEntryInput",
                type: FormTypeEnum.DATUM_SELECT,
                label: "Wundverlaufseintrag",
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
                type: FormTypeEnum.DATUM_SELECT,
                label: "Wundverlaufseintrag",
            },
            {
                property: "woundImageInput",
                type: FormTypeEnum.DATUM_SELECT,
                label: "Wundfoto(s)",
            },
            {
                property: "woundMeasurementInput",
                type: FormTypeEnum.DATUM_SELECT,
                label: "Wundmaße",
            },
        ]
    }
]