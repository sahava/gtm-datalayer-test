const _ = require('lodash')
const Ajv = require('ajv')
const SCHEMA = 'http://json-schema.org/schema#'
const validTestConfSchema = require('./validTestConfSchema.json')

const getJsonSchema = confObj => {
    // Build schema
    const validSchema = {
        "$schema" : SCHEMA,
        "type" : "array",
        "not" : {
            "items" : {
                "not": {
                    "type" : "object",
                    "properties" : {}
                }
            }
        }
    }
    const root = validSchema.not.items.not
    let required = true
    _.forOwn(confObj, (val, key) => {
        if (_.isPlainObject(val) && _.has(val, '@rootRequired')) {
            required = val['@rootRequired'] !== false
            delete val['@rootRequired']
        }
        root.properties[key] = val
        if (required) {
            root.required = root.required || []
            root.required.push(key)
        }
    })
    return validSchema
}

const getWindowDataLayer = dataLayerName => browser
  .execute(function(dataLayerName) { return window[dataLayerName] }, dataLayerName)
  .value

const validate = testJson => {
    const ajv = new Ajv()
    const valid = ajv.validate(validTestConfSchema, testJson)
    if (!valid) {
        _.forEach(ajv.errors, i => {
            console.error(i.dataPath + ' ' + i.message)
        })
        throw new Error('Invalid schema')
    }
}

module.exports = {
    getWindowDataLayer: getWindowDataLayer,
    getJsonSchema: getJsonSchema,
    validate: validate
}