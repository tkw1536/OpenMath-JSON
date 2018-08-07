# OpenMath-JSON

A Proposal for an OpenMath JSON encoding -- see [doc/openmath.md](doc/openmath.md) for concrete examples and documentation. 

The actual encoding can be found in [schema/openmath.d.ts](schema/openmath.d.ts). 
It is implemented as a set of TypeScript Definitions. 
This makes it extremely easy to use in existing TypeScript projects. 

For use in other languages, it can be compiled into a [JSON Schema](http://json-schema.org). 
This is achieved using [ts-json-schema-generator](https://github.com/vega/ts-json-schema-generator). 

If [yarn](https://yarnpkg.com/en/) is installed locally, this can be automatically achieved using:

```bash
# To install ts-json-schema-generator
yarn

# To generate a JSON Schema into schema/openmath.json
yarn saveschema
```

Afterwards a JSON Schema can be found in `schema/openmath.json`. 

## License

CC-BY-3.0. See [LICENSE](LICENSE). 