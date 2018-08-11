import {convertToJSON, convertToXML} from "../../src/convert";
import {validateJSON} from "../../src/schema/";
import {readXMLFixture, readJSONFixture} from "../fixtures";

import {strict as assert} from "assert";
import {XMLSerializer} from "xmldom";

// #region "Helper functions"
function checkJSON(name: string, base?: string) {
    const theJSON = readJSONFixture(name);
    const validation = validateJSON(theJSON, base);

    validation.errors.forEach((e) => {throw e});
}


function checkXML2JSON(name: string) {
    // load xml and convert it
    const theXML = readXMLFixture(name);
    const theJSON = convertToJSON(theXML);

    // compare it to the expected json
    const expectedJSON = readJSONFixture(name);
    
    assert.deepStrictEqual(theJSON, expectedJSON);
}

const serializer = new XMLSerializer();
function checkJSON2XML(name : string) {
    // load json and convert it
    const theJSON = readJSONFixture(name);
    const theXML = convertToXML(theJSON);

    // compare it to the expected xml
    const expectedXML = readXMLFixture(name);
    assert.strictEqual(
        serializer.serializeToString(theXML),
        serializer.serializeToString(expectedXML)
    );
}

// #endregion

/**
 * Declares a test suite for a fixture
 * @param name Name of fixture test to declare
 */
function declareFixtureTest(name: string, desc: string, base?: string){
    const skipForward = name.startsWith('>');
    const skipBackward = name.startsWith('<');

    const theName = (skipForward || skipBackward) ? name.substring(1) : name;

    describe(desc, () => {
        it('should contain valid json of type ' + (base || 'omany'), () => {
            checkJSON(theName, base);
        })
        

        if(!skipForward){
            it('should be convertible from xml to json', () => {
                checkXML2JSON(theName);
            });
        }

        if(!skipBackward){
            it('should be convertible from json to xml', () => {
                checkJSON2XML(theName);
            });
        }
    });
}


describe('OpenMath Integers (OMI)', () => {
    [
        [ 'omi/10_int', 'Integer 10'], 
        ['>omi/10_dec', 'Decimal 10'],
        [ 'omi/10_hex', 'Hexadecimal 10'],

        [ 'omi/-120_int', 'Integer -120'],
        ['>omi/-120_dec', 'Decimal -120'],
        [ 'omi/-120_hex', 'Hexadecimal -120'],

    ].forEach(args => {declareFixtureTest(args[0], args[1], 'OMI')});
});


describe('OpenMath Symbols (OMS)', () => {
    [
        [ 'oms/sin', 'sin symbol']

    ].forEach(args => {declareFixtureTest(args[0], args[1], 'OMS')});
});

