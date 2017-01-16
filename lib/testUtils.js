const _ = require('lodash')
const SCHEMA = 'http://json-schema.org/schema#'

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
        if (_.isPlainObject(val) && val.rootRequired === false) {
            delete val.rootRequired
            required = false
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

module.exports = {
    getWindowDataLayer: getWindowDataLayer,
    getJsonSchema: getJsonSchema
}