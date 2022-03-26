import {omany} from "../../src/schema/openmath";
import {convertToJSON, convertToXML} from "../../src/convert";

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

import {DOMParser, XMLSerializer} from "@xmldom/xmldom";


/** the path to an xml fixture */
function xmlPath(name: string) {
    return join(__dirname, name + '.xml');
}

/** the path to a JSON fixture */
function jsonPath(name: string) {
    return join(__dirname, name + '.json');
}

/** read in an XML fixture */
export function readXMLFixture(name : string): Element {
    const str = readFileSync(xmlPath(name), 'utf8');
    return new DOMParser().parseFromString(str).documentElement;
}

/** read in a JSON fixture */
export function readJSONFixture(name : string): omany {
    const str = readFileSync(jsonPath(name), 'utf8');
    return JSON.parse(str);
}

/** make an xml fixture from JSON */
function makeXMLFixture(name: string) {
    const theJSON = readJSONFixture(name);
    const theXML = convertToXML(theJSON);

    const serializer = new XMLSerializer()
    writeFileSync(xmlPath(name), serializer.serializeToString(theXML));
    console.log('Wrote ' + xmlPath(name) + '.');
}

/** make a json fixture from XML */
function makeJSONFixture(name: string) {
    const theXML = readXMLFixture(name);
    const theJSON = convertToJSON(theXML);

    writeFileSync(jsonPath(name), JSON.stringify(theJSON, undefined, 4));
    console.log('Wrote ' + jsonPath(name) + '.');
}


if (require.main === module) {
    const args = process.argv;
    if(args.length != 4 || (args[2] != 'xml' && args[2] != 'json')){
        console.error('Usage: test/fixtures xml|json <name>');
        process.exit(-1);
    }

    if(args[2] == 'xml'){
        makeXMLFixture(args[3]);
    } else {
        makeJSONFixture(args[3]);
    }
}