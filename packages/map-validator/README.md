# map-validator

This library Validates a map-stack json object using a collection of [Validators](./src/lib/validator.ts).
The main validation is a json schema validator [Ajv](https://github.com/epoberezkin/ajv) using the map-stack json
[schema](./src/lib/schema). In addition, a collection of rule based validations are performed, such are geometric tests
and name uniqueness tests.
