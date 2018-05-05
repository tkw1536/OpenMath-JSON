# OpenMath-JSON

A Work-In-Progress on an (as yet unofficial) OpenMath JSON Encoding

## File Structure

The type definition is in [schema/openmath.d.ts](schema/openmath.d.ts) as a TypeScript Defintion file. 

A [JSON Schema](http://json-schema.org/) is automatically generated using [ts-json-schema-generator](https://github.com/vega/ts-json-schema-generator). 
If [yarn](https://yarnpkg.com/en/) is installed, this can be automatically achieved using:

```bash
# To install ts-json-schema-generator
yarn

# To generate a JSON Schema into schema/openmath.json
yarn saveschema
```

## License

CC-BY-3.0. See [LICENSE](LICENSE). 