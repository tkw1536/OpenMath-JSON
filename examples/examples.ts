import { OMR, OMA, OMI, OMF, OMS, OMV, OMSTR, OMB, OMOBJ, OMBIND, OMATTR, OME } from "../src/schema/openmath";

// a few different symbols
export const symbolSIN: OMS = {
    kind: 'OMS',

    cdbase: 'http://www.openmath.org/cd',
    cd: 'transc1',
    name: 'sin'
}


// a variable
export const variable: OMV = {
    kind: 'OMV',

    name: 'x'
}

// the float 1 * 10 ^ -10 in three representatins
export const floatAsNative: OMF = {
    kind: 'OMF',
    
    float: 1e-10
}

export const floatAsDec: OMF = {
    kind: 'OMF',

    decimal: '1.0e-10'
}

export const floatAsHex: OMF = {
    kind: 'OMF', 

    hexadecimal: '3DDB7CDFD9D7BDBB'
}

// a string 'Hello world'
export const str: OMSTR = {
    kind: 'OMSTR', 

    string: 'Hello world'
}

// a set of bytes (corresponding to "hello world") in two different representations
export const bytesAsNative: OMB = {
    kind: 'OMB', 

    bytes: [104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]
}

export const bytesAsBase64: OMB = {
    kind: 'OMB',

    base64: 'aGVsbG8gd29ybGQ='
}

// application, e.g. sin(x) from above
export const application: OMA = {
    kind: 'OMA',

    applicant: {
        kind: 'OMS',

        cd: 'transc1',
        name: 'sin'
    },

    arguments: [{
            kind: 'OMV',
            name: 'x'
    }]
}

// binding, e.g. lambda x: sin(x)
export const binding : OMBIND = {
    kind: 'OMBIND',

    binder: {
        kind: 'OMS', 

        cd: 'fns1',
        name: 'lambda'
    }, 

    variables: [{
        kind: 'OMV', 
        name: 'x'
    }], 

    object: { // sin(x) from above
        kind: 'OMA',
    
        applicant: {
            kind: 'OMS',
    
            cd: 'transc1',
            name: 'sin'
        },
    
        arguments: [{
                kind: 'OMV',
                name: 'x'
        }]
    }
}

// attribution

export const attribution1 : OMATTR = {
    kind: 'OMATTR', 

    attributes: [
        [
            {kind: 'OMS', cd: 'ecc', name: 'type'}, 
            {kind: 'OMS', cd: 'ecc', name: 'real'}
        ]
    ], 

    object: { kind: 'OMV', name: 'x'}
}

export const attribution2: OMATTR = {
    kind: 'OMATTR', 

    attributes: [
        [
            {kind: 'OMS', cd: 'annotations1', name: 'presentation-form'}, 
            {kind: 'OMFOREIGN', encoding: 'text/x-latex', foreign: '\\sin(x)' }
        ]
    ], 

    object: { // sin(x) from above
        kind: 'OMA',
    
        applicant: {
            kind: 'OMS',
    
            cd: 'transc1',
            name: 'sin'
        },
    
        arguments: [{
                kind: 'OMV',
                name: 'x'
        }]
    }
}

// errors

export const error: OME = {
    kind: 'OME', 
    
    error: {
        kind: 'OMS', 

        cd: 'aritherror', 
        name: 'DivisionByZero'
    }, 

    arguments: [
        { // divide(x, 0)

            kind: 'OMA', 

            applicant: {
                kind: 'OMS', 
                
                cd: 'arith1', 
                name: 'divide'
            }, 

            arguments: [
                { kind: 'OMV', name: 'x' }, 
                { kind: 'OMI', integer: 0 }
            ]
        }
    ]
}

// a simple object
const obj: OMOBJ = {
    kind: 'OMOBJ', 
    openmath: '2.0',

    object: { kind: 'OMSTR', string: 'Hello world' }
}

// an object with a reference
const reffed: OMOBJ = {
    kind: 'OMOBJ', 

    object: {
        kind: 'OMA', 

        applicant: { kind: 'OMV', name: 'f' }, 
        
        arguments: [
            {
                kind: 'OMA',
                id: 't1',

                applicant: { kind: 'OMV', name: 'f' },

                arguments: [
                    {
                        kind: 'OMA',
                        id: 't11',

                        applicant: { kind: 'OMV', name: 'f' },

                        arguments: [
                            { kind: 'OMV', name: 'a' }, 
                            { kind: 'OMV', name: 'a' }
                        ]
                    }, 

                    {
                        kind: 'OMR', 
                        href: '#t11'
                    }
                ]
            }, 
            {
                kind: 'OMR', 
                href: '#t1'
            }
        ]
    }
}
