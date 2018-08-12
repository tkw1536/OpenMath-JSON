import {omany, omel, OMOBJ, OMS, OMFOREIGN, OME, OMV, OMI, OMB, OMSTR, OMF, OMA, OMBIND, attvars, attvar, OMATTR, omattributes, OMR} from "../schema/openmath";

import {XMLSerializer} from "xmldom";

// #region "Helper Functions"

/**
 * Finishes conversion of node to a JSON result. 
 * Dangerous, the caller needs to ensure that all attributes are set. 
 * 
 * @param node XML node to convert
 * @param result partial result
 * @param attributes attributes to convert
 */
function makeJSON<T>(
    node: Element, result: Partial<T>,
    attributes: (any[] | (keyof T))[]
) : T {
    attributes.forEach((args) => {
        if(typeof args === "string"){
            args = [args];
        }
        result = makeJSONAttribute.call(undefined, node, result, ...args as any[]);
    });
    // dangerous type-cohersion, needs to be checked by caller
    return result as T;
}

/**
 * Helper function to convert an attribute from xml to json
 * @param node XML node to convert
 * @param result partial result object
 * @param xmlName name of XML attribute
 * @param resultName optionally different name of result object attribute
 * @param converter optional converter to parse the attribute
 */
function makeJSONAttribute<T extends omany, S extends keyof T>(
    node: Element, result: Partial<T>, 
    xmlName: string, resultName?: S,
    converter?: (string) => T[S]
): Partial<T> {
    if(!resultName){
        resultName = xmlName as S;
    }
    if(node.hasAttribute(xmlName)){
        if(typeof converter === 'function'){
            result[resultName] = converter(node.getAttribute(xmlName));
        } else {
            // assume that the converter is the identity
            // which may be dangerous
            result[resultName] = node.getAttribute(xmlName) as any;
        }
    }
    return result as T;
}

/**
 * 
 * @param node node to check
 * @param type type to check
 */
function assertNodeType(node: Node, type: string) {
    const name = node.nodeName.toLowerCase();
    if(name !== type.toLowerCase()){
        throw new Error("Expected node to be of type '" + type + "', but got '" + name + "'");
    }
}

/** gets all the children of an element that are also an element */
function getChildElements(node: Element): Element[] {
    return Array.prototype.filter.call(node.childNodes, c => c.nodeType === 1);
}

// #endregion

/** convert a valid OpenMath XML object into OpenMath JSON */
export function convert(xml: Element): omany {
    return convertomany(xml);
}

function convertomany(node: Element): omany {
    switch(node.nodeName.toUpperCase()){
        case 'OMOBJ':
            return convertOMOBJ(node);
        case 'OMFOREIGN':
            return convertOMFOREIGN(node);
        default:
            return convertomel(node);
    }
}

function convertOMOBJ(node: Element): OMOBJ {
    assertNodeType(node, 'OMOBJ');
    const nodeChildren = getChildElements(node);

    const omobj: Partial<OMOBJ> = {
        kind: "OMOBJ",
        object: convertomel(nodeChildren[0]),
    };

    return makeJSON(
        node, omobj,
        [
            'id',
            'cdbase',
            ['version', 'openmath', (version: string) => "2.0"]
        ]
    );
}

function convertomel(node: Element): omel {
    switch(node.nodeName.toUpperCase()){
        case 'OMS':
            return convertOMS(node);
        case 'OMV':
            return convertOMV(node);
        case 'OMI':
            return convertOMI(node);
        case 'OMB':
            return convertOMB(node);
        case 'OMSTR':
            return convertOMSTR(node);
        case 'OMF':
            return convertOMF(node);
        case 'OMA':
            return convertOMA(node);
        case 'OMBIND':
            return convertOMBIND(node);
        case 'OME':
            return convertOME(node);
        case 'OMATTR':
            return convertOMATTR(node);
        case 'OMR':
            return convertOMR(node);
        default:
            throw new Error('Invalid XML. ');
    }

}

function convertOMS(node: Element): OMS {
    assertNodeType(node, 'OMS');
    
    const oms: Partial<OMS> = {
        kind: "OMS",
    };

    return makeJSON(
        node, oms,
        [
            'id',
            'cdbase',
            'cd',
            'name'
        ]
    );
}

function convertOMV(node: Element): OMV {
    assertNodeType(node, 'OMV');

    const omv: Partial<OMV> = {
        kind: "OMV"
    };

    return makeJSON(
        node, omv,
        [
            'id',
            'name'
        ]
    );
}

function convertOMI(node: Element): OMI {
    assertNodeType(node, 'OMI');

    const omi: Partial<OMI> = {
        kind: "OMI"
    };

    const number = node.textContent;  

    // in case of a hexa-decimal valid keep it as is
    if(number.startsWith('x') || number.startsWith('-x')){
        omi["hexadecimal"] = number;
    } else {
        // if we have a parseable, finite number
        // then turn it into a native js number
        const numericNumber = Number(number);
        if(!isNaN(numericNumber) && isFinite(numericNumber)){
            omi["integer"] = numericNumber;
        
        // else it is too big, so keep it as is
        } else {
            omi["decimal"] = number;
        }
    }

    return makeJSON(
        node, omi,
        [ 'id' ]
    );
}

function convertOMB(node: Element): OMB {
    assertNodeType(node, 'OMB');

    const omb: Partial<OMB> = {
        kind: "OMB",
        base64: node.textContent.trim(),
    };

    return makeJSON(
        node, omb, 
        [ 'id' ]
    );
}

function convertOMSTR(node: Element): OMSTR {
    assertNodeType(node, 'OMSTR');

    return {
        kind: "OMSTR",
        string: node.textContent
    }
}

function convertOMF(node: Element): OMF {
    assertNodeType(node, 'OMF');

    const omf: Partial<OMF> = {
        kind: "OMF"
    };

    // set the decimal attribute
    if(node.hasAttribute('dec')){
        omf['decimal'] = node.getAttribute('dec');
    } else {
        omf['hexadecimal'] = node.getAttribute('hex');
    }

    return makeJSON(
        node, omf,
        [ 
            'id'
        ]
    );
}

function convertOMA(node: Element): OMA {
    assertNodeType(node, 'OMA');
    const nodeChildren = getChildElements(node);

    const oma: Partial<OMA> = {
        kind: "OMA",
        applicant: convertomel(nodeChildren[0])
    };

    const args = nodeChildren.slice(1).map(convertomel);
    if(args.length > 0){
        oma['arguments'] = args;
    }

    return makeJSON(
        node, oma,
        [ 
            'id',
            'cdbase'
        ]
    );
}

function convertOMBIND(node: Element): OMBIND {
    assertNodeType(node, 'OMBIND');
    const nodeChildren = getChildElements(node);

    const omb: Partial<OMBIND> = {
        kind: "OMBIND",
        binder: convertomel(nodeChildren[0]),
        variables: convertOMBVAR(nodeChildren[1]),
        object: convertomel(nodeChildren[2])
    };

    return makeJSON(
        node, omb,
        [ 
            'id',
            'cdbase'
        ]
    );
}

function convertOMBVAR(node: Element): attvars {
    assertNodeType(node, 'OMBVAR');
    const nodeChildren = getChildElements(node);

    // TODO: Take care of id cdbase properly
    return nodeChildren.map(convertomvar);
}

function convertomvar(node: Element): (OMV | attvar) {
    if(node.nodeName.toUpperCase() === 'OMV'){
        return convertOMV(node);
    }

    return convertOMATTR(node) as attvar;

}

function convertOME(node: Element): OME {
    assertNodeType(node, 'OME');
    const nodeChildren = getChildElements(node);

    const ome: Partial<OME> = {
        kind: "OME",
        error: convertOMS(nodeChildren[0])
    };

    const args = nodeChildren.slice(1).map(convertomany);
    if(args.length > 0){
        ome['arguments'] = args as (omel|OMFOREIGN)[];
    }

    return makeJSON(
        node, ome,
        [ 
            'id'
        ]
    );
}

function convertOMATTR(node: Element): OMATTR {
    assertNodeType(node, 'OMATTR');
    const nodeChildren = getChildElements(node);

    const omattr: Partial<OMATTR> = {
        kind: "OMATTR",
        attributes: convertOMATP(nodeChildren[0]),
        object: convertomel(nodeChildren[1])
    }

    return makeJSON(
        node, omattr,
        [
            'id', 
            'cdbase'
        ]
    )
}

function convertOMATP(node: Element): omattributes {
    assertNodeType(node, 'OMATP');

    let attributes: ([OMS, omel|OMFOREIGN])[]  = [];
    
    const nodeChildren = getChildElements(node);
    for(let i = 0; i + 1 < nodeChildren.length; i = i + 2){
        attributes.push(
            [
                convertOMS(nodeChildren[i]),
                convertomany(nodeChildren[i + 1]) as (omel|OMFOREIGN)
            ]
        )
    }

    // TODO: Take care of id, cdbase properly
    return attributes;
}

function convertOMR(node: Element): OMR {
    assertNodeType(node, 'OMR');

    const omr: Partial<OMR> = {
        kind: "OMR"
    }

    return makeJSON(
        node, omr,
        [
            'id',
            'href'
        ]
    )
}

const serializer = new XMLSerializer();
function convertOMFOREIGN(node: Element): OMFOREIGN {
    assertNodeType(node, 'OMFOREIGN');

    // TODO: We should handle omels
    const omforeign: Partial<OMFOREIGN> = {
        kind: "OMFOREIGN",
        foreign: serializer.serializeToString(node.childNodes[0])
    }

    return makeJSON(
        node, omforeign,
        [
            'id',
            'encoding',
            'cdbase'
        ]
    )
}