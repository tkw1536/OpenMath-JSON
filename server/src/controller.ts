import express from "express";
import morgan from "morgan";
import { join } from "path";

import bodyParser from "body-parser";
import {DOMParser, XMLSerializer} from "xmldom"

// #region "Implementation"

import {TValidationResult, TJSONConversionResult, TXMLConversionResult} from "./api";

import {validateJSON} from "../../src/";
import {convertToJSON, convertToXML} from "../../src/";

function validate(req: express.Request, kind?: string): TValidationResult {
    try {
        const json = JSON.parse(req.body);
        const result = validateJSON(json, kind);
        return {success: true, result: {valid: result.valid, errors: result.errors}};
    } catch(e) {
        return {success: false, message: e.message};
    }
}

const parser = new DOMParser()
function convertJSON(req: express.Request): TJSONConversionResult {
    try {
        const xml = parser.parseFromString(req.body).documentElement;
        if(!xml){
            throw new Error('Invalid XML: No element present. ');
        }
        const result = convertToJSON(xml);
        return {success: true, result: result};
    } catch(e) {
        return {success: false, message: e.message};
    }
}

const serializer = new XMLSerializer()
function convertXML(req: express.Request): TXMLConversionResult {
    try {
        const json = JSON.parse(req.body); // TODO: Parse XML
        const result = convertToXML(json);
        return {success: true, result: serializer.serializeToString(result)};
    } catch(e) {
        return {success: false, message: e.message};
    }
}



// #endregion


// #region "Router"
const router = express.Router();

router.use(morgan("tiny"));

router.use('/api/v1/', bodyParser.text({type: "*/*"}));
router.use('/api/v1/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.post('/api/v1/validate', (req: express.Request, res: express.Response) => {
    const result = validate(req, req.query.kind);
    res.jsonp(result);
});

// /api/v1/convert/json: Converts to JSON
router.post('/api/v1/convert/json', (req: express.Request, res: express.Response) => {
    const result = convertJSON(req);
    res.jsonp(result);
});

// /api/v1/convert/xml: Converts to XML
router.post('/api/v1/convert/xml', (req: express.Request, res: express.Response) => {
    const result = convertXML(req);
    res.jsonp(result);
});


// /download/openmath.d.ts Serve TypeScript Definition file
// /download/openmath.json Serve OpenMath JSON
router.get('/download/openmath.d.ts', (req: express.Request, res: express.Response) => {
    res.download(join(__dirname, '..', 'schema', 'openmath.d.ts'));
});
router.get('/download/openmath.json', (req: express.Request, res: express.Response) => {
    res.download(join(__dirname, '..', 'schema', 'openmath.json'));
});
router.use('/', express.static(join(__dirname, 'static')));
// #endregion

export const Controller = router;