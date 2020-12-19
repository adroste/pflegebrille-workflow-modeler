import { DataTypeEnum } from './enum/DataTypeEnum';
import { enumToModdleEnum } from './util';

/**
 * Important hints for changing/extending the model:
 * - DO NOT use stuff like isId, isReference, etc. 
 *   it is ALL BROKEN and does not work properly for custom elements.
 *   Just use strings and do manual mapping and checking
 * - don't inherit from bpmn:BaseElement or other bpmn types
 * - ExtensionElements must inherit from Element
 * - don't extend bpmn elements with custom properties, its buggy af
 * - if you use / do anything that has not already been done 
 *   in any of the types below, you can be certain that it will 
 *   not work properly without further digging into bpmn-js, moddle & co
 *   (importer & treewalker are some little bitches that are not under my control)
 */

export const pbModdle = {
    name: "Pflegebrille BPMN Extension",
    uri: "http://pflegebrille.de/schema/bpmn/pb-extension",
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
            superClass: [
                "Element",
            ],
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
        /** 
         * A function is an extension element that describes the inner workings of a parent element. 
         * Typically, only one function per parent is allowed.
         */
        {
            name: "Function",
            isAbstract: true,
            superClass: [
                "Element"
            ],
        },
        /**
         * For ManualTask
         */
        {
            name: "MediaText",
            superClass: [
                "Function"
            ],
            meta: {
                allowedIn: [
                    "bpmn:ManualTask"
                ],
                title: "Beschreibung / Medien anzeigen",
            },
            properties: [
                {
                    name: "text",
                    isAttr: true,
                    type: "String",
                },
                {
                    name: "mediaAssetId",
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
            meta: {
                allowedIn: [
                    "bpmn:UserTask"
                ],
                title: "Schmerzwert abfragen"
            }
        },
        {
            name: "WoundPicture",
            superClass: [
                "Function"
            ],
            meta: {
                allowedIn: [
                    "bpmn:UserTask"
                ],
                title: "Wundfoto aufnehmen"
            }
        },
        {
            name: "WoundDetection",
            superClass: [
                "Function"
            ],
            meta: {
                allowedIn: [
                    "bpmn:UserTask"
                ],
                title: "Wunde vermessen"
            }
        },
        /**
         * For ServiceTask
         */
        {
            name: "ModifyDataCollection",
            superClass: [
                "Function"
            ],
            meta: {
                allowedIn: [
                    "bpmn:ServiceTask"
                ],
                title: "Datenobjekt bearbeiten (für mehrere Elemente)"
            }
        },
        {
            name: "GetMedicationData",
            superClass: [
                "Function"
            ],
            meta: {
                allowedIn: [
                    "bpmn:ServiceTask"
                ],
                title: "[GET] Medikationen"
            }
        },
        {
            name: "GetPatientData",
            superClass: [
                "Function"
            ],
            meta: {
                allowedIn: [
                    "bpmn:ServiceTask"
                ],
                title: "[GET] Patientendaten"
            }
        },
        {
            name: "GetWoundHistory",
            superClass: [
                "Function"
            ],
            meta: {
                allowedIn: [
                    "bpmn:ServiceTask"
                ],
                title: "[GET] Wundverlauf"
            }
        },
        {
            name: "GetDiagnosisHistory",
            superClass: [
                "Function"
            ],
            meta: {
                allowedIn: [
                    "bpmn:ServiceTask"
                ],
                title: "[GET] Diagnosen"
            }
        },
        {
            name: "PostWoundData",
            superClass: [
                "Function"
            ],
            meta: {
                allowedIn: [
                    "bpmn:ServiceTask"
                ],
                title: "[POST] Wunddaten"
            }
        },
        {
            name: "PostWoundImage",
            superClass: [
                "Function"
            ],
            meta: {
                allowedIn: [
                    "bpmn:ServiceTask"
                ],
                title: "[POST] Wundbild"
            }
        }
    ],
}