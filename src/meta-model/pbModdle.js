import { DataTypeEnum } from './enum/DataTypeEnum';
import { enumToModdleEnum } from './util';

/**
 * Important hints for changing/extending the model:
 * - If you change something, it certainly breaks existing workflows!
 * - IDs must not begin with a number, spec: https://www.w3.org/TR/REC-xml/#NT-NameChar
 * - use `moddle.ids.nextPrefixed` for id generation
 * - DO NOT use two or more body properties with the same type,
 *   by default matching on import is done by type, 
 *   so it will only work for the first property,
 *   UNLESS you change serialization mode for given properties 
 *   via: `xml: { serialize: "xsi:type" }`
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
        {
            name: "DataInputOutputRef",
            isAbstract: true,
            properties: [
                {
                    name: "dataRef",
                    isAttr: true,
                    isReference: true,
                    type: "bpmn:ItemAwareElement",
                },
            ]
        },
        {
            name: "DataInputRef",
            superClass: [
                "DataInputOutputRef"
            ]
        },
        {
            name: "DataOutputRef",
            superClass: [
                "DataInputOutputRef"
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
                    type: "DataInputRef",
                    xml: { serialize: "xsi:type" },
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
                    type: "DataInputRef",
                    xml: { serialize: "xsi:type" },
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
                    type: "DataOutputRef",
                    xml: { serialize: "xsi:type" },
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
                    type: "DataOutputRef",
                    xml: { serialize: "xsi:type" },
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
                    type: "DataOutputRef",
                    xml: { serialize: "xsi:type" },
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
                    type: "DataOutputRef",
                    xml: { serialize: "xsi:type" },
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
                    type: "DataOutputRef",
                    xml: { serialize: "xsi:type" },
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
                    type: "DataOutputRef",
                    xml: { serialize: "xsi:type" },
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
                    type: "DataOutputRef",
                    xml: { serialize: "xsi:type" },
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
                    type: "DataOutputRef",
                    xml: { serialize: "xsi:type" },
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
                    type: "DataOutputRef",
                    xml: { serialize: "xsi:type" },
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
                    type: "DataInputRef",
                    xml: { serialize: "xsi:type" },
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
                    type: "DataInputRef",
                    xml: { serialize: "xsi:type" },
                },
            ]
        }
    ],
}