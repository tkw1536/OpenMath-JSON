/**
 * TypeScript Definitions for a work-in-progress OpenMath JSON Encoding
 * 
 * (c) Tom Wiesing 2018
 * @license CC-BY-3.0
 */

/** OpenMath Object Constructor */
export interface OMOBJ extends withCD {
    kind: 'OMOBJ'
    version?: '2.0'

    object: omel
}

/** Elements which can appear inside an OpenMath object */
type omel = OMS | OMV | OMI | OMB | OMSTR | OMF | OMA | OMBIND | OME | OMATTR | OMR;


/** Symbol */
export interface OMS extends withCD {
    kind: 'OMS'

    /** name of the symbol */
    name: name
    /** content dictonary the symbol is in */
    cd: uri
}


/** Variable */
export interface OMV extends referencable {
    kind: 'OMV'

    /** the name of the variable */
    name: name
}

/** integer */
export interface OMI extends referencable {
    kind: 'OMI'

    /** the integer */
    integer: integer
}

/** bytes */
export interface OMB extends referencable {
    kind: 'OMB'

    /** the bytes */
    bytes: bytes
}

/** String */
export interface OMSTR extends referencable {
    kind: 'OMSTR'

    /** the string */
    string: string
}


/** IEEE floating point */
export interface OMF extends referencable {
    kind: 'OMF'

    /** the floating point number */
    float: float
}

/** Application */
export interface OMA extends withCD {
    kind: 'OMA'

    /** the term that is being applied */
    applicant: omel // TODO: Name

    /** the arguments that the applicant is being applied to */
    arguments: omel[]
}

/** Binding */
export interface OMBIND extends withCD {
    kind: 'OMBIND'

    /** the binder being used */
    binder: omel

    /** the variables being bound */
    variables: attvars

    /** the object that is being bo */
    object: omel
}

/**
 * List of variables or attributed variables
 * @minItems 1
 */
type attvars = (OMV | attvar)[];

/** Attributed variable */
interface attvar extends OMATTR {
    object: OMV
}

/** Error */
export interface OME extends referencable {
    kind: 'OME'

    /** the error that has occured */
    error: OMS

    /** arguments to the error  */
    arguments: (omel|OMFOREIGN)[] // TODO: Rename this?
}

/** Attributed object */
export interface OMATTR extends withCD {
    kind: 'OMATTR'

    /** object that is being attributed */
    object: omel

    /** attributes attributed to this object */
    attributes: omattributes
}

/**
 * Attributes for the OMATTR Constructor
 * @minItems 1
*/
type omattributes = ([OMS, omel])[];


/** Non-OpenMath object  */
export interface OMFOREIGN extends withCD {
    kind: 'OMFOREIGN'

    /** encoding of the foreign object */
    encoding?: string

    /** the foreign object */
    foreign: any // TODO: Do we want to disallow OpenMath Elements here?
}

/** Reference to another element within the same structure */
export interface OMR extends referencable {
    kind: 'OMR'

    /** element that is being referenced */
    href: uri
}

// #region "base"

/** any element */
interface element {
    /** the kind of OpenMath Element this type describes */
    kind: string
}

/** any element that can be referenced */
interface referencable extends element {
    /** id of this element, if it is used for structure sharing */
    id?: name
}

/** any elements that can have a CDBase */
interface withCD extends referencable {
    /** base URI to use for any cds within this element */
    cdbase?: uri
}

// #endregion


// #region "Helpers"

/**
 * A URI
 * 
 * @format uri
 */
type uri = string;

/**
 * A valid name
 */
type name = string;

/**
 * An integer
 * 
 * @asType integer
 */
type integer = number;

/**
 * A floating point number
 */
type float = number;

/**
 * A set of bytes of data
 */
type bytes = byte[] | base64string;

/**
 * A byte
 * 
 * @minimum 0
 * @exclusiveMinimum false
 * @maximum 255
 * @exclusiveMaximum false
 * @asType integer
 */
type byte = number;

/**
 * Base64-encoded string
 * 
 * @pattern ^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$
 */
type base64string = string;

// #endregion