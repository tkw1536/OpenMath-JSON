# An OpenMath JSON Encoding

This document describes the proposed OpenMath JSON Encoding. 

## Existing Proposals

There are several existing proposals that allow encoding OpenMath 2.0 objects as JSON. 

### XML as JSON

One obvious approach would be to use the existing XML encoding. 

A standard for this is [JSONML](http://www.jsonml.org) -- which describes a way to encode any XML term in JSON. 


For example the term `plus(x, 5)` would look like this: 

```json
[  
   "OMOBJ",
   {  
      "xmlns":"http://www.openmath.org/OpenMath"
   },
   [  
      "OMA",
      [  
         "OMS",
         {  
            "cd":"arith1",
            "name":"plus"
         }
      ],
      [  
         "OMV",
         {  
            "name":"x"
         }
      ],
      [  
         "OMI",
         "5"
      ]
   ]
]
```

This has the advantage that it is near-trivial to translate between the XML and JSON encodings of OpenMath. 

It however also has several disadvantages:

- The encoding does not use the native JSON datatypes.  
  One of the advantages of JSON is that it can encode most basic data types directly, without having to turn the data values into strings. 
  To encode the floating point value `1e-10` (a valid JSON literal) using the JSONML encoding, one can not directly place it into the result. 
  Instead, one has to turn it into a string first.   
  Most JSON implementations provide such a functionality, however in practice this means that frequent translation between strings and high-level datatypes is required.  
  This is not what JSON is intended for, instead the provided data types should be used. 
- The akwardness of some of the XML encoding remains.   
  Due to the nature of XML the XML encoding sometimes needs to introduce elements that do not directly correspond to any OpenMath objects. 
  For example, the `OMATP` element is used to encode a set of attribute / value pairs. 
  This introduces unnecessary overhead into JSON, as an array of values could be used instead. 
- Many languages use JSON-like structures to implement structured data types.   
  Thus it stands to reason that an OpenMath JSON encoding should also provide a schema to allow languages to implement OpenMath easily. This is not the case for a JSONML encoding. 

### OpenMath-JS

Another existing encoding of OpenMath encoding as JSON is called [openmath-js](https://github.com/lurchmath/openmath-js). 

For example, the term `plus(x, 5)` would be encoded as 

```json
{  
   "t":"a",
   "c": [  
      {  
         "t":"sy",
         "cd":"arith1",
         "n":"plus"
      },
      {  
         "t":"v",
         "n":"x"
      },
      {  
         "t":"i",
         "v":"5"
      }
   ]
}
```

This encoding solves some of the disadvantages of the JSONML encoding, however it still has some drawbacks:

- It was written as a JavaScript, not JSON, encoding.  
  The existing library provides JavaScript functions to encode OpenMath objects.  
  However, the resulting JSON has only minimal names. 
  This makes it difficult for humans to read and write directly. 
- No formal schema exists. 

## The Proposal

This proposal aims to describe an OpenMath encoding and achieve the following: 

- Create a programming language-independent [JSON Schema](http://json-schema.org)
- Ensure that all attibute names are human-reable and understandable
- Make translation from XML to JSON schema easily possible
- Use JSON-native types where possible, and avoid XML peculiarities like pseudo elements

The concrete schema is implemented as a set of TypeScript Definitions, which can be easily written and read by humans. 
It is then compiled into a JSON Schema. 
The details of this can be found in the [README](../README.md)

### General Strucure
In general, each OpenMath object is represented as a JSON structure. 
For example: 

```json
{
    "kind": "OMV",
    "id": "something",
    "name": "x"
}
```

Here we can already see two important features:

1. The `kind` attribute, which defines the kind of OpenMath object in question.   
  This has to be present on every OpenMath JSON object, and the values are the corresponding OpenMath XML element name. 
  It can be used to easily distinguish between the different types of objects.   
  In TypeScript terms, this is called a *TypeGuard*. 
2. The `id` attribute, which can be used for Structure sharing.   
  This works similar to the XML encoding, but more on this later. 

This is expressed using the following two types:

- the `element` type  
  Used by any OpenMath (or OpenMath-related) element, and only enforces that `kind` is a string. 
- the `referencable` type
  Any OpenMath element that can optionally be given an `id`. 
- the `withCD` type
  Used by any OpenMath element which uses a `cdBase` base url. 

Note that for simplicity, we omit the `id` attribute in any of the following. 

### Helper Types

While JSON provides many types, sometimes more restrictions than the general type is required. 
The JSON Schema provides several facilities for this, for example strings matching a particular regular expression. 

The schema uses the following helper types: 

* `uri`: any URI encoded as a string.   
  This uses the JSONSchema `format: uri`. 
* `name`: any valid name. 
  In this schema uses any kind of string. 
* `integer`: any arbitrary depth JSON-native integer. 
  Uses JSON numbers as underlying type, and the JSON Schema `number` type. 
* `decimalInteger`: a string representing the decimal expansion of an integer. 
  Uses the regular expression `^-?[0-9]+$`. 
* `hexInteger`: a string representing the heximadecimal expansion of an integer. 
  Uses the regular expression `^-?x[0-9A-F]+.$`. 
* `float`: any IEEE 32-bit integer, represented as a native JSON integer. 
* `decimalFloat`: a string representing the decimal expansion of an IEEE floating point number. 
  Uses the regular expression `^(-?)([0-9]+)?("."[0-9]+)?([eE](-?)[0-9]+)?$`. 
* `hexFloat`: a string representing the hexadecimal expansion of an IEEE floating point number.  
  Uses the regular expression `^([0-9A-F]+)$`. 
* `byte`: a byte of data represented as an integer, between `0` and `255` (inclusive). 
* `base64string`: a string representing a set of bytes encoded as a `base64` string. 
  Uses the regular expression `^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$`. 

### OMOBJ -- OpenMath Object Constructor

We can use the `OMOBJ` type to create a new OpenMath object. 

```ts
{
    "kind": "OMOBJ",

    /** optional version of openmath being used */
    "openmath": "2.0",

    /** the actual object */
    "object": omel /* any element, see below */
}
```

For example, the integer `3`: 

```json
{
    "kind": "OMOBJ",
    "openmath": "2.0",
    "object": {
        "kind": "OMI", 
        "integer": 3
    }
}
```

The object can be any OpenMath element, as expressed by the `omel` type. 

### The omel type

The `omel` type represents any element

It is defined as any of the following:

- `OMS`
- `OMV`
- `OMI`
- `OMB`
- `OMSTR`
- `OMF`
- `OMA`
- `OMBIND`
- `OME`
- `OMATTR`
- `OMR`

### OMS - Symbol

A symbol is represented using the `OMS` type. 

```ts
{
    "kind": "OMS",

    /** the base for the cd, optional */
    "cdbase": uri, 

    /** content dictonary the symbol is in, any uri */
    "cd": uri

    /** name of the symbol */
    "name": name
}
```

For example the `sin` symbol from the `transc1` content dictionary: 

```json
{
    "kind": "OMS",

    "cd": "transc1",
    "name": "sin"
}
```

### OMV - Variable

A variable is represented using the `OMV` type. 

```ts
{
    "kind": "OMV",

    /** name of the variable */
    "name": name
}
```

For example, the variable `x`: 

```json
{
    "kind": "OMV",
    "name": "x"
}
```

### OMI - Integers

Integers can be represented in three different ways, to both make use of json and enable easy translation from the XML encoding. 

#### JSON Integers

Integers can be represented as a native JSON Integer, using an `integer` property. 

```ts
{
    "kind": "OMI",

    /** integer value */
    "integer": integer
}
```

```json
{
    "kind": "OMI",
    "integer": -120
}
```

#### Decimal Integers

Integers can be represented using their decimal encoding, using the `decimal` property:

```ts
{
    "kind": "OMI", 

    /** decimal value */
    "decimal": decimalInteger
}
```

```json
{
    "kind": "OMI",
    "decimal": "-120"
}
```

#### Hexadecimal Integers

Integers can be represented using their hexadecimal encoding, using the `hexadecimal` property:

```ts
{
    "kind": "OMI",

    /** hexadecimal value */
    "hexadecimal": hexInteger
}
```

```json
{
    "kind": "OMI",
    "hexadecimal": "-x78"
}
```

### OMF - Floats

Floats, like integers, can be represented in three different ways. 

#### JSON Floats

Floats can be represented as a native JSON Numbers, using a `float` property. 

```ts
{
    "kind": "OMF",

    /** float value */
    "float": float
}
```

```json
{
    "kind": "OMF",
    "float": 1e-10
}
```

#### Decimal Floating Point Numbers

Integers can be represented using their decimal encoding, using the `decimal` property:

```ts
{
    "kind": "OMF",

    /** decimal value */
    "decimal": decimalFloat
}
```

```json
{
    "kind": "OMF",
    "decimal": "1.0e-10"
}
```

#### Hexadecimal Floats

Floats can be represented using their hexadecimal encoding, using the `hexadecimal` property:

```ts
{
    "kind": "OMF",

    /** hexadecimal value */
    "hexadecimal": hexFloat
}
```

```json
{
    "kind": "OMF",
    "hexaecimal": "3DDB7CDFD9D7BDBB"
}
```

### OMB - Bytes

Byte Arrays can be represented using two ways, as a native array of JSON integers, or base64-encoded as a string. 

#### JSON Byte Arrays

Bytes can be represented as a native JSON Byte Array, using a `bytes` property. 

```ts
{
    "kind": "OMB",

    /** an array of bytes */
    "bytes": byte[]
}
```

```json
{
    "kind": "OMB",
    "bytes": [104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]
}
```

#### Base64-encoded bytes

Bytes can also be encoded as a base64 encoded string.

```js
{
    "kind": "OMB",

    /** a base64 encoded string */
    "base64": base64string
}
```

```json
{
    "kind": "OMB",
    "base64": "aGVsbG8gd29ybGQ="
}
```

### OMS -- Strings

Strings can be represented using normal JSON strings and the `OMS` type. 

```ts
{
    "kind": "OMSTR", 

    /** the string */
    "string": string
}
```

For example:


```json
{
    "kind": "OMSTR", 
    "string": "Hello world"
}
```

### OMA -- Application

Applications can be represented using the `OMA` type. 

```ts
{
    "kind": "OMA", 

    /** the base for the cd, optional */
    "cdbase": uri, 

    /** the term that is being applied */
    "applicant": omel, 

    /** the arguments that the applicant is being applied to, optional */
    "arguments"?: omel[]
}
```

For example: 

```json
{
    "kind": "OMA",

    "applicant": {
        "kind": "OMS",

        "cd": "transc1",
        "name": "sin"
    },

    "arguments": [{
            "kind": "OMV",
            "name": "x"
    }]
}
```

### OMA -- Attribution

Attribution can be represented using the `OMB` type. 

```ts
{
    "kind": "OMATTR", 

    /** the base for the cd, optional */
    "cdbase": uri, 

    /** attributes attributed to this object, non-empty */
    "attributes": ([
        OMS, omel|OMFOREIGN
    ])[]

    /** object that is being attributed */
    "object": omel
}
```

Here the attributes are being encoded as an array of pairs. 
Each pair consists of a symbol (the attribute name) and a value (an element or foreign element). 

For example:
```json
{
    "kind": "OMATTR",
    "attributes": [
        [
            {
                "kind": "OMS",
                "cd": "ecc",
                "name": "type"
            },
            {
                "kind": "OMS",
                "cd": "ecc",
                "name": "real"
            }
        ]
    ],
    "object": {
        "kind": "OMV",
        "name": "x"
    }
}
```

### OMB - Binding

Binding can be represented using the `OMB` type. 

```ts
{
    "kind": "OMBIND", 

    /** the base for the cd, optional */
    "cdbase": uri, 

    /** the binder being used */
    "binder": omel

    /** the variables being bound, non-empty */
    "variables": (OMV | attvar)[]

    /** the object that is being bound */
    "object": omel
}
```

Here, the variables can be a list of variables or attributed variables. 
Attributed variables are represented using the `attvar` type. 
This is any `OMATTR` element (see above), where the `object` being attributed is an `OMV` instance. 

For example:

```json
{  
    "kind": "OMBIND",
    "binder":{  
        "kind": "OMS",
        "cd": "fns1",
        "name": "lambda"
    },
    "variables":[  
        {  
            "kind": "OMV",
            "name": "x"
        }
    ],
    "object": {  
        "kind": "OMA",
        "applicant": {  
            "kind": "OMS",
            "cd": "transc1",
            "name":"sin"
        },
        "arguments": [  
            {  
                "kind":"OMV",
                "name":"x"
            }
        ]
    }
}
```

### OME - Errors

Errors can be represented using the `OME` object:

```ts
{
    "kind": "OME", 

    /** the error that has occured */
    "error": OMS,

    /** arguments to the error, optional  */
    "arguments": (omel|OMFOREIGN)[]
}
```

Here, the variables can be a list of elements or foreign objects. 

For example:

```json
{
    "kind": "OME",
    "error": {
        "kind": "OMS",
        "cd": "aritherror",
        "name": "DivisionByZero"
    },
    "arguments": [
        {
            "kind": "OMA",
            "applicant": {
                "kind": "OMS",
                "cd": "arith1",
                "name": "divide"
            },
            "arguments": [
                {
                    "kind": "OMV",
                    "name": "x"
                },
                {
                    "kind": "OMI",
                    "integer": 0
                }
            ]
        }
    ]
}
```

### OMRs and Structure Sharing

Just like in the XML encoding, the `OMR` type can be used for structure sharing. 
This can use an `href` property. 

```ts
{
    "kind": "OMR"

    /** element that is being referenced */
    "href": uri
}
```

For example: 

```json
{
    "kind": "OMOBJ",
    "object": {
        "kind": "OMA",
        "applicant": {
            "kind": "OMV",
            "name": "f"
        },
        "arguments": [
            {
                "kind": "OMA",
                "id": "t1",
                "applicant": {
                    "kind": "OMV",
                    "name": "f"
                },
                "arguments": [
                    {
                        "kind": "OMA",
                        "id": "t11",
                        "applicant": {
                            "kind": "OMV",
                            "name": "f"
                        },
                        "arguments": [
                            {
                                "kind": "OMV",
                                "name": "a"
                            },
                            {
                                "kind": "OMV",
                                "name": "a"
                            }
                        ]
                    },
                    {
                        "kind": "OMR",
                        "href": "#t11"
                    }
                ]
            },
            {
                "kind": "OMR",
                "href": "#t1"
            }
        ]
    }
}
```

### OMFOREIGN - Foreign Objects

Just like in the XML encoding, the `OMFOREIGN` type can be used for foreign objects. 
This can use an `href` property. 

```ts
{
    "kind": "OMFOREIGN"

    /** encoding of the foreign object */
    "encoding"?: string

    /** the foreign object */
    "foreign": any
}
```

For example: 

```json
{
    "kind": "OMFOREIGN",
    "encoding": "text/latex",
    "foreign": "$x=\frac{1+y}{1+2z^2}$"
}
```