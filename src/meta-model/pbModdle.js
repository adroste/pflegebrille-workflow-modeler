import { DataTypeEnum } from './enum/DataTypeEnum';
import { enumToModdleEnum } from './util';

/**
 * Important hints for changing/extending the model:
 * - If you change something, it certainly breaks existing workflows!
 * - DO NOT use stuff like isId, isReference, etc. 
 *   it is ALL BROKEN and does not work properly for custom elements.
 *   Just use strings and do manual mapping and checking
 * - DO NOT inherit from bpmn:BaseElement or other bpmn types
 * - ExtensionElements must inherit from Element
 * - DO NOT extend bpmn elements with custom properties, its buggy af
 * - DO NOT use the same DataType twice in an input/output, it will be ambigious
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
                },
                {
                    name: "name",
                    isAttr: true,
                    type: "String",
                }
            ]
        },
        {
            name: "AssetRef",
            properties: [
                {
                    name: "refId",
                    isAttr: true,
                    type: "String",
                },
            ]
        },
        {
            name: "Assets",
            properties: [
                {
                    name: "assets",
                    isMany: true,
                    type: "Asset",
                },
            ]
        },
        /**
         * Task functions
         */
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
            name: "ManualTaskExtension",
            superClass: [
                "ActivityExtension"
            ],
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
                    type: "DataInputRef"
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
                    type: "DataOutputRef"
                },
            ]
        },
        /**
         * For ManualTask
         */
        {
            name: "MediaText",
            superClass: [
                "Function"
            ],
            properties: [
                {
                    name: "text",
                    isAttr: true,
                    type: "String",
                },
                {
                    // TODO
                    name: "mediaAssetRef",
                    isAttr: true,
                    type: "String",
                }
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
        },
        {
            name: "WoundPicture",
            superClass: [
                "Function"
            ],
        },
        {
            name: "WoundDetection",
            superClass: [
                "Function"
            ],
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
            name: "GetMedicationData",
            superClass: [
                "ApiInputFunction"
            ],
        },
        {
            name: "GetPatientData",
            superClass: [
                "ApiInputFunction"
            ],
        },
        {
            name: "GetWoundHistory",
            superClass: [
                "ApiInputFunction"
            ],
        },
        {
            name: "GetDiagnosisHistory",
            superClass: [
                "ApiInputFunction"
            ],
        },
        {
            name: "PostWoundData",
            superClass: [
                "ApiOutputFunction"
            ],
            properties: [
                {
                    name: "woundInformationInput",
                    type: "DataInputRef"
                },
            ]
        },
        {
            name: "PostWoundImage",
            superClass: [
                "ApiOutputFunction"
            ],
        }
    ],
}