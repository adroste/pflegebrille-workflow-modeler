import { DataTypeEnum } from './enum/DataTypeEnum';
import { enumToModdleEnum } from './util';

/**
 * Important hints for changing/extending the model:
 * - If you change something, it certainly breaks existing workflows!
 * - IDs must not begin with a number, spec: https://www.w3.org/TR/REC-xml/#NT-NameChar
 * - use `moddle.ids.nextPrefixed` for id generation
 * - DO NOT use two or more body properties with the same type,
 *   matching on import is done by type, so it will only work for the first property
 *   Workaround: serialize via property name: `xml: { serialize: "xsi:type" }`
 * - DO NOT inherit from bpmn:BaseElement or other bpmn types
 * - ExtensionElements must inherit from Element, 
 *   otherwise they magically disappear on re-import
 * - TRY NOT to extend bpmn elements with custom properties, its buggy sometimes
 * - if you use / do anything that has not already been done 
 *   in any of the types below, you can be certain that it will 
 *   not work properly without further digging into bpmn-js, moddle & co
 *   (importer & treewalker are some little bitches that are not under my control)
 */

export const pbModdle = {
    name: "Pflegebrille BPMN Extension",
    uri: "http://pflegebrille.de/schema/bpmn/pb-extension/v1.0.0",
    prefix: "pb",
    xml: {
        tagAlias: "lowerCase"
    },
    enumerations: [
        enumToModdleEnum('DataTypeEnum', DataTypeEnum),
    ],
    types: [
        {
            name: "Asset",
            properties: [
                {
                    name: "id",
                    isAttr: true,
                    type: "String",
                    isId: true,
                },
                {
                    name: "name",
                    isAttr: true,
                    type: "String",
                }
            ]
        },
        {
            name: "Assets",
            superClass: [
                "Element"
            ],
            properties: [
                {
                    name: "assets",
                    isMany: true,
                    type: "Asset",
                },
            ]
        },
        {
            name: "DataObjectExtension",
            superClass: [
                "Element"
            ],
            properties: [
                {
                    name: "dataType",
                    isAttr: true,
                    type: "DataTypeEnum",
                },
            ]
        },
        /**
         * Task functions
         */
        {
            name: "MediaText",
            superClass: [
                "Element"
            ],
            properties: [
                {
                    name: "text",
                    isAttr: true,
                    type: "String",
                },
                {
                    name: "mediaAssetRef",
                    isAttr: true,
                    isReference: true,
                    type: "Asset",
                }
            ]
        },
        {
            name: "ActivityExtension",
            superClass: [
                "Element",
            ],
            properties: [
                {
                    name: "function",
                    type: "Function",
                },
            ]
        },
        {
            name: "ServiceTaskExtension",
            superClass: [
                "ActivityExtension"
            ]
        },
        {
            name: "UserTaskExtension",
            superClass: [
                "ActivityExtension"
            ]
        },
        {
            name: "Function",
            isAbstract: true,
        },
        {
            name: "ApiInputFunction",
            isAbstract: true,
            superClass: [
                "Function"
            ],
            properties: [
                {
                    name: "transactionInput",
                    isAttr: true,
                    isReference: true,
                    type: "bpmn:ItemAwareElement"
                },
            ]
        },
        {
            name: "PatientContextFunction",
            isAbstract: true,
            superClass: [
                "Function"
            ],
            properties: [
                {
                    name: "patientRefInput",
                    isAttr: true,
                    isReference: true,
                    type: "bpmn:ItemAwareElement"
                },
            ]
        },
        {
            name: "ApiOutputFunction",
            isAbstract: true,
            superClass: [
                "Function"
            ],
            properties: [
                {
                    name: "transactionOutput",
                    isAttr: true,
                    isReference: true,
                    type: "bpmn:ItemAwareElement"
                },
            ]
        },
        /**
         * For UserTask
         */
        {
            name: "PainScale",
            superClass: [
                "Function"
            ],
            properties: [
                {
                    name: "painValueOutput",
                    isAttr: true,
                    isReference: true,
                    type: "bpmn:ItemAwareElement"
                },
            ]
        },
        {
            name: "PatientSelect",
            superClass: [
                "Function"
            ],
            properties: [
                {
                    name: "patientRefOutput",
                    isAttr: true,
                    isReference: true,
                    type: "bpmn:ItemAwareElement"
                },
            ]
        },
        {
            name: "WoundDetection",
            superClass: [
                "Function"
            ],
            properties: [
                {
                    name: "woundDataOutput",
                    isAttr: true,
                    isReference: true,
                    type: "bpmn:ItemAwareElement"
                },
            ]
        },
        {
            name: "WoundPicture",
            superClass: [
                "Function"
            ],
            properties: [
                {
                    name: "woundPictureOutput",
                    isAttr: true,
                    isReference: true,
                    type: "bpmn:ItemAwareElement"
                },
            ]
        },
        /**
         * For ServiceTask
         */
        {
            name: "ModifyDataCollection",
            superClass: [
                "Function"
            ],
        },
        {
            name: "GetDiagnosisHistory",
            superClass: [
                "ApiInputFunction",
                "PatientContextFunction",
            ],
            properties: [
                {
                    name: "diagnosisHistoryOutput",
                    isAttr: true,
                    isReference: true,
                    type: "bpmn:ItemAwareElement"
                },
            ]
        },
        {
            name: "GetMedicationHistory",
            superClass: [
                "ApiInputFunction",
                "PatientContextFunction",
            ],
            properties: [
                {
                    name: "medicationHistoryOutput",
                    isAttr: true,
                    isReference: true,
                    type: "bpmn:ItemAwareElement"
                },
            ]
        },
        {
            name: "GetPatientData",
            superClass: [
                "ApiInputFunction",
                "PatientContextFunction",
            ],
            properties: [
                {
                    name: "patientDataOutput",
                    isAttr: true,
                    isReference: true,
                    type: "bpmn:ItemAwareElement"
                },
            ]
        },
        {
            name: "GetWoundHistory",
            superClass: [
                "ApiInputFunction",
                "PatientContextFunction",
            ],
            properties: [
                {
                    name: "woundHistoryOutput",
                    isAttr: true,
                    isReference: true,
                    type: "bpmn:ItemAwareElement"
                },
            ]
        },
        {
            name: "PostWoundData",
            superClass: [
                "ApiOutputFunction",
                "PatientContextFunction",
            ],
            properties: [
                {
                    name: "woundDataInput",
                    isAttr: true,
                    isReference: true,
                    type: "bpmn:ItemAwareElement"
                },
            ]
        },
        {
            name: "PostWoundImage",
            superClass: [
                "ApiOutputFunction",
                "PatientContextFunction",
            ],
            properties: [
                {
                    name: "woundImageInput",
                    isAttr: true,
                    isReference: true,
                    type: "bpmn:ItemAwareElement"
                },
            ]
        }
    ],
}