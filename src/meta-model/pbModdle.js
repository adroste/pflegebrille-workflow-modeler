import { DataTypeEnum } from './enum/DataTypeEnum';
import { ElementPositionEnum } from './enum/ElementPositionEnum';
import { enumToModdleEnum } from './util';

/**
 * Important hints for changing/extending the model:
 * - YOU MUST increment version number in uri on change!
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
        enumToModdleEnum('ElementPositionEnum', ElementPositionEnum),
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
            name: "PatientContextFunction",
            isAbstract: true,
            superClass: [
                "Function"
            ],
            properties: [
                {
                    name: "patientInput",
                    type: "DataInputRef",
                    xml: { serialize: "xsi:type" },
                },
            ]
        },
        {
            name: "WoundContextFunction",
            isAbstract: true,
            superClass: [
                "Function"
            ],
            properties: [
                {
                    name: "woundInput",
                    type: "DataInputRef",
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
                    name: "patientOutput",
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
                    name: "woundPictureInput",
                    type: "DataInputRef",
                    xml: { serialize: "xsi:type" },
                },
                {
                    name: "woundMeasurementOutput",
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
        {
            name: "WoundSelect",
            superClass: [
                "PatientContextFunction"
            ],
            properties: [
                {
                    name: "woundOutput",
                    type: "DataOutputRef",
                    xml: { serialize: "xsi:type" },
                },
            ]
        },
        /**
         * For ServiceTask
         */
        {
            name: "ConcatData",
            superClass: [
                "Function"
            ],
            properties: [
                {
                    name: "firstInput",
                    type: "DataInputRef",
                    xml: { serialize: "xsi:type" },
                },
                {
                    name: "secondInput",
                    type: "DataInputRef",
                    xml: { serialize: "xsi:type" },
                },
                {
                    name: "collectionOutput",
                    type: "DataOutputRef",
                    xml: { serialize: "xsi:type" },
                },
            ]
        },
        {
            name: "DeleteDataFromCollection",
            superClass: [
                "Function"
            ],
            properties: [
                {
                    name: "position",
                    isAttr: true,
                    type: "ElementPositionEnum",
                    xml: { serialize: "xsi:type" },
                },
                {
                    name: "collectionInput",
                    type: "DataInputRef",
                    xml: { serialize: "xsi:type" },
                },
                {
                    name: "collectionOutput",
                    type: "DataOutputRef",
                    xml: { serialize: "xsi:type" },
                },
            ]
        },
        {
            name: "SelectDataFromCollection",
            superClass: [
                "Function"
            ],
            properties: [
                {
                    name: "position",
                    isAttr: true,
                    type: "ElementPositionEnum",
                    xml: { serialize: "xsi:type" },
                },
                {
                    name: "collectionInput",
                    type: "DataInputRef",
                    xml: { serialize: "xsi:type" },
                },
                {
                    name: "dataOutput",
                    type: "DataOutputRef",
                    xml: { serialize: "xsi:type" },
                },
            ]
        },
        {
            name: "PostWoundHistoryEntry",
            superClass: [
                "PatientContextFunction",
                "WoundContextFunction",
            ],
            properties: [
                {
                    name: "woundHistoryEntryInput",
                    type: "DataInputRef",
                    xml: { serialize: "xsi:type" },
                },
            ]
        },
        {
            name: "CreateWoundHistoryEntry",
            superClass: [
                "Function",
            ],
            properties: [
                {
                    name: "woundHistoryEntryOutput",
                    type: "DataOutputRef",
                    xml: { serialize: "xsi:type" },
                },
                {
                    name: "woundImageInput",
                    type: "DataInputRef",
                    xml: { serialize: "xsi:type" },
                },
                {
                    name: "woundMeasurementInput",
                    type: "DataInputRef",
                    xml: { serialize: "xsi:type" },
                },
            ]
        }
    ],
}