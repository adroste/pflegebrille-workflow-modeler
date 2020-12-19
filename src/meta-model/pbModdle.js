import { DataTypeEnum } from './enum/DataTypeEnum';
import { enumToModdleEnum } from './util';

/**
 * Important hints for changing/extending the model:
 * - setting isId causes extension elements to be removed on re-import
 * - don't inherit vom bpmn:BaseElement or other bpmn types
 * - ExtensionElements must inherit from Element
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
            name: "AssetDefinitions",
            isAbstract: true,
            extends: [
                "bpmn:Definitions",
            ],
            properties: [
                {
                    name: "assets",
                    isMany: true,
                    type: "Asset"
                }
            ]
        },
        {
            name: "Asset",
            properties: [
                {
                    name: "path",
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
                    name: "mediaSrc",
                    isAttr: true,
                    isReference: true,
                    type: "Asset",
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