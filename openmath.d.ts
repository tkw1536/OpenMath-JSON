/**
 * TypeScript Definitions for a work-in-progress OpenMath JSON Encoding
 * 
 * (c) Tom Wiesing 2018
 * @license CC-BY-3.0
 */

/** OpenMath Object Constructor */
interface OMOBJ extends compound {
    kind: 'OMOBJ'
    version?: '2.0'

    object: omel
}

/** Elements which can appear inside an OpenMath object */
type omel = OMS | OMV | OMI | OMB | OMSTR | OMF | OMA | OMBIND | OME | OMATTR | OMR;

// things which can be variables
type omvar = OMV | attvar;

interface attvar extends common {
    kind: 'OMATTR', 
    
    // TODO: names
    pair: OMATP, 
    variables: OMV | attvar
}


interface cdbase {
    // TODO: URI types
    cdbase?: string
}


/** attributes common to all elements */
interface common {
    id?: string
}

/** common elements that also take a cdbase */
type commonBase = common & cdbase;

// TODO: Does compound make sense?
/** attributes common to all elements that construct compount OM objects */
type compound = common & cdbase;


/** a symbol */
interface OMS extends commonBase {
    kind: 'OMS'

    name: string
    cd: string
}


/** a variable */
interface OMV extends common {
    kind: 'OMV'

    name: string
}

/** integer */
interface OMI extends common {
    kind: 'OMI'

    // TODO: Annotate integer
    integer: number
}

/** bytes */
interface OMB extends common {
    kind: 'OMB'

    // TODO: Encode as base64
    bytes: string
}

/** string */
interface OMSTR extends common {
    kind: 'OMSTR'

    string: string
}


/** an IEEE floating point  */
interface OMF extends common {
    kind: 'OMF'

    // TODO: Restrict to IEEE floating point
    float: number
}

/** application */
interface OMA extends compound {
    kind: 'OMA'

    // TODO: Names
    application: omel
    arguments: omel[]
}

/** binding constructor */
interface OMBIND extends compound {
    kind: 'OMBIND'

    // TODO: Names
    binder: omel
    variables: OMBVAR
    bound: omel
}

// TODO: Pull this into the above
/** variables used in binding constructor */
interface OMBVAR extends common {
    kind: 'OMBVAR'

    variables: [omel]
}

/** an error constructor */
interface OME extends common {
    kind: 'OME'

    // TODO: Names
    error: OMS
    arguments: (omel|OMFOREIGN)[]
}

/** attribution constructor and attribute pair constructor */
interface OMATTR extends compound {
    kind: 'OMATTR'

    // TODO: Names
    pairs: OMATP
    subject: omel
}

// TODO: Implement +
interface OMATP extends compound {
    kind: 'OMATP'

    // TODO: names
    pair: OMATP
    variables: omel | OMFOREIGN
}

/** Foreign Constructor  */
interface OMFOREIGN extends compound {
    kind: 'OMFOREIGN'

    enoding?: string
    foreign: any
}

/** reference constructor */
interface OMR extends common {
    kind: 'OMR'

    href: string
}