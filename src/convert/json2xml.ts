import {DOMImplementation} from "@xmldom/xmldom";

import {omany, omel, OMOBJ, OMS, OMFOREIGN, OME, OMV, OMI, OMB, OMSTR, OMF, OMA, OMBIND, attvars, attvar, OMATTR, omattributes, OMR} from "../schema/openmath";

// a pseudo-document to create elements under
const implementation = new DOMImplementation();
const OPENMATH_NAMESPACE = "http://www.openmath.org/OpenMath";
const document = implementation.createDocument(OPENMATH_NAMESPACE, null, null);

// #region "Helper Functions"

/** helper function to create an element */
function makeElement<T extends omany>(
    name: string, 
    obj?: T, properties?: (keyof T)[], 
    ...childrenOrContent: (Node | String)[]
){
    const element = document.createElementNS(OPENMATH_NAMESPACE, name);

    if(typeof obj !== "undefined" && obj !== null){
        const theProps = makeProps<T>(obj, ...properties);
        for(var key in theProps){
            setAttribute(element, key, theProps[key]);
        }
    }

    if(childrenOrContent.length === 1 && typeof childrenOrContent[0] === 'string'){
        element.textContent = childrenOrContent[0] as string;
    } else {
        childrenOrContent.forEach((node: Node) => {
            element.appendChild(node);
        });
    }

    return element;
}

function setAttribute(node: Element, name: string, value: string) {
    node.setAttributeNS(OPENMATH_NAMESPACE, name, value);
}

/**
 * 
 * @param obj Object to create properties from
 * @param properties List of properties to read
 */
function makeProps<T extends omany>(obj: T, ...properties: (keyof T)[]) : {[key: string]: any} {
    const theProps: {[key: string]: any} = {};
    properties.forEach((p: keyof T) => {
        const prop = obj[p];
        if(typeof prop !== "undefined"){
            theProps[p as string] =  obj[p];
        }
    });
    return theProps;
}

// #endregion

export function convert(json: omany): Element {
    return convertomany(json);
}

function convertomany(json: omany) : Element {
    switch(json.kind) {
        case "OMOBJ":
            return convertOMOBJ(json);
        case "OMFOREIGN":
            return convertOMFOREIGN(json);
        default:
            return convertomel(json);
    }
}

function convertOMOBJ(json: OMOBJ) : Element {
    const node = makeElement(
        'OMOBJ', json, 
        ['id'],
        convertomel(json.object)
    );

    if(json['openmath'] === '2.0'){
        setAttribute(node, 'version', '2.0');
    }

    return node;
}

function convertomel(json: omel): Element {
    switch(json.kind){
        case 'OMS':
            return convertOMS(json);
        case 'OMV':
            return convertOMV(json);
        case 'OMI':
            return convertOMI(json);
        case 'OMB':
            return convertOMB(json);
        case 'OMSTR':
            return convertOMSTR(json);
        case 'OMF':
            return convertOMF(json);
        case 'OMA':
            return convertOMA(json);
        case 'OMBIND':
            return convertOMBIND(json);
        case 'OME':
            return convertOME(json);
        case 'OMATTR':
            return convertOMATTR(json);
        case 'OMR':
            return convertOMR(json);
    }
}

function convertOMS(json: OMS) : Element {
    return makeElement(
        'OMS', json, 
        ['id', 'cdbase', 'cd', 'name']
    );
}

function convertOMV(json: OMV) : Element {
    return makeElement(
        'OMV', json, 
        ['id', 'name']
    );
}

function convertOMI(json: OMI) : Element {
    // extract a numeric string
    let number: string;
    if(typeof json["integer"] !== "undefined"){
        number = json["integer"].toString();
    } else if(typeof json["hexadecimal"] !== "undefined"){
        number = json["hexadecimal"].toString();
    } else {
        number = json["decimal"].toString();
    }
    
    return makeElement(
        'OMI', json, 
        ['id'],
        document.createTextNode(number)
    );
}

function convertOMB(json: OMB): Element {
    // create a base64 string
    let base64: string;
    if(typeof json["bytes"] !== "undefined"){
        base64 = Buffer.from(json["bytes"]).toString('base64');
    } else {
        base64 = json["base64"];
    }
    
    return makeElement(
        'OMB', json, 
        ['id'],
        document.createTextNode(base64)
    );
}

function convertOMSTR(json: OMSTR): Element {
    return makeElement(
        'OMSTR', json,
        ['id'], 
        document.createTextNode(json.string)
    )
}

function convertOMF(json: OMF) : Element {
    const omf = makeElement(
        'OMF', json, 
        ['id']
    );

    // set the numeric value
    if(typeof json["float"] !== "undefined"){
        setAttribute(omf, "dec", json["float"].toString());
    } else if(typeof json["hexadecimal"] !== "undefined"){
        setAttribute(omf, "hex", json["hexadecimal"].toString());
    } else {
        setAttribute(omf, "dec", json["decimal"].toString());
    }

    return omf;
}

function convertOMA(json: OMA): Element {
    const applicant = convertomel(json.applicant);
    const args = (json.arguments || []).map(convertomel);

    return makeElement(
        'OMA', json, 
        ['id', 'cdbase'], 
        applicant, ...args
    );
}

function convertOMBIND(json: OMBIND): Element {
    const binder = convertomel(json.binder);
    const ombvar = convertOMBVAR(json.variables);
    const object = convertomel(json.object);

    return makeElement(
        'OMBIND', json, 
        ['id', 'cdbase'], 
        binder, ombvar, object
    );
}

function convertOMBVAR(json: (OMV | attvar)[]) : Element {
    const children = json.map((e) => (e.kind === 'OMV') ? convertOMV(e) : convertOMATTR(e));

    return makeElement(
        'OMBVAR', undefined, undefined, 
        ...children
    );
}

function convertOME(json: OME) : Element {
    const error = convertOMS(json.error);
    const args = (json.arguments || []).map(convertomany);

    return makeElement(
        'OME', json, 
        ['id'],
        error, ...args
    )
}

function convertOMATTR(json: OMATTR): Element {
    const omatp = convertOMATP(json.attributes);
    const obj = convertomel(json.object);

    return makeElement(
        'OMATTR', json,
        ['id', 'cdbase'],
        omatp, obj
    );
}

function convertOMATP(json: omattributes): Element {
    let children: Node[] = [];

    json.forEach((v: [OMS, omel|OMFOREIGN]) => {
        children.push(convertOMS(v[0]));
        children.push(convertomany(v[1]));
    });

    return makeElement(
        'OMATP', null, null, 
        ...children
    );
}

function convertOMR(json: OMR): Element {
    return makeElement(
        'OMR', json,
        ['id', 'href']
    );
}

function convertOMFOREIGN(json: OMFOREIGN): Element {
    const foreign = document.createTextNode(json.foreign);

    return makeElement(
        'OMFOREIGN', json,
        ['id', 'encoding', 'cdbase'],
        foreign
    );
}