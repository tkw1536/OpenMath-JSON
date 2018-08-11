import schema from "./openmath.json";
import { Validator, ValidatorResult } from "jsonschema";
import { Options } from "body-parser";

const v = new Validator();

/**
 * Parse a string, and check it is valid OpenMath JSON
 * @param src src string to validate
 */
export function validate(src: string, kind?: string): (ValidatorResult|null) {
    // parse the JSON or fail fatally
    let instance;
    try {
        instance = JSON.parse(src);
    } catch(e) {
        return null;
    }

    return validateJSON(instance, kind);
}

// the set of known kinds we allow validation against
const knownKinds = [
    'omany', 
    'OMOBJ',
    'omel',
    'OMS',
    'OMV',
    'OMI',
    'OMF',
    'OMB',
    'OMSTR',
    'OMA',
    'OMATTR',
    'OMBIND',
    'attvar',
    'OME',
    'OMFOREIGN',
    'OMR'
];

/**
 * Check if an existing JSON object is a valid OpenMath JSON Object
 * @param src 
 */
export function validateJSON(src: any, kind?: string): (ValidatorResult) {
    const theSchema = Object.assign({}, schema);
    if (kind && knownKinds.indexOf(kind) >= 0) {
        theSchema["$ref"] = "#/definitions/" + kind;
    }
    return v.validate(src, theSchema, {nestedErrors: true} as {});
}