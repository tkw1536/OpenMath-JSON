# OpenMath-JSON

![CI Status](https://github.com/tkw1536/OpenMath-JSON/workflows/CI/badge.svg)

A Proposal for an OpenMath JSON encoding -- see [doc/openmath.md](doc/openmath.md) for concrete examples and documentation. 

## The Encoding

The actual encoding can be found in [src/schema/openmath.d.ts](src/schema//openmath.d.ts). 
It is implemented as a set of TypeScript Definitions.

It can also be compiled into a [JSON Schema](http://json-schema.org), for easy validation. 
This is achieved using [ts-json-schema-generator](https://github.com/vega/ts-json-schema-generator). 
If [yarn](https://yarnpkg.com/en/) is installed locally, you can run:

```bash
# To install ts-json-schema-generator
yarn

# To generate a JSON Schema into src/schema/openmath.json
yarn saveschema
```

[The Resulting File](src/schema/openmath.json) is committed in the repository. 

## Demo Website and Conversion to/from XML

Along with the encoding itself, this repository contains a TypeScript Implementation that can convert between the JSON and XML OpenMath encodings. 
This can be found in the [src/convert/](src/convert) folder. 

Furthermore, an implementation that validates a given JSON object against the JSON Schema is also present. 
This is demonstrated in the form of a website and an API. 

The demo website can be found at [https://omjson.openmath.org](https://omjson.openmath.org). 

The website can be run locally by typing:

```
cd server && yarn && yarn serveprod
```

or using the automated Docker Build [tkw01536/openmath-json-demo](https://hub.docker.com/r/tkw01536/openmath-json-demo/):

```
docker run -p 3000:3000 tkw01536/openmath-json-demo
```

## License

CC-BY-3.0. See [LICENSE](LICENSE). 
