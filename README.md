# gtm-datalayer-test
Automated functional testing for Google Tag Manager's Data Layer.

## Installation
1. Clone the repo with `git clone https://github.com/sahava/gtm-datalayer-test.git`
2. Run `npm install` to install the dependencies
3. Run `npm test` to run the example script

## npm test
The `npm test` script does the following:

1. Starts a simple HTTP server on http://localhost:8080, with the `index.html` from ./examples.
2. Runs the ./examples/spec/basic_example.js spec against the mock dataLayer in `index.html`
3. Stops the HTTP server

You can use this script to quickly see how the solution works. Be sure to check both dataLayer.js and dataLayer.conf.json to understand how the JSON validation works against the actual `window.dataLayer` object.

## Technology
* [ajv](https://www.npmjs.com/package/ajv) for validating the configuration JSON
* [chai](https://www.npmjs.com/package/chai) for test assertions
* [chai-json-schema](https://www.npmjs.com/package/chai-json-schema) for dataLayer JSON schema validation
* [chai-subset](https://www.npmjs.com/package/chai-subset) for dataLayer subset validation
* [http-server](https://www.npmjs.com/package/http-server) for testing the solution on localhost
* [wdio](https://www.npmjs.com/package/wdio) for wrapping webdriverio
* [wdio-mocha-framework](https://www.npmjs.com/package/wdio-mocha-framework) for using mocha as the test runner
* [wdio-phantomjs-service](https://www.npmjs.com/package/chai) for using the headless phantomjs browser for tests
* [wdio-selenium-standalone-service](https://www.npmjs.com/package/selenium-standalone-service) to simplify Selenium install and start
* [wdio-spec-reporter](https://www.npmjs.com/package/wdio-spec-reporter) for providing a spec reporter for the tests
* [webdriverio](https://www.npmjs.com/package/webdriverio) for simplifying Selenium test writing and running

## How it works
In `examples/spec/basic_example.conf.json` (see below), you specify both global key-value pairs as well as page-specific configurations. These dataLayer compositions will then be searched on every page (global configuration) as well as on specific pages (page-specific configurations).

You can enforce the schema in `basic_example.conf.json` using (a very slightly customized) **JSON Schema (v4)** to describe the objects in `window.dataLayer`, or you can use a simple **subset check**.

###JSON Schema
You can describe the `window.dataLayer` objects using JSON Schema. Each object you add to the `dataLayer` property in the configuration (global or page-specific), will be compiled into its own schema, and this schema will then be checked against the global `window.dataLayer` structure. There are some slight modifications and hacks to accomodate for the fact that JSON Schema doesn't play that well with Arrays of indeterminate length and composition (such as `window.dataLayer` often is).

##Subset check
You can also simply use a subset check, where you specify each `dataLayer` object (global or page-specific) with all the keys and values that you expect to find in `dataLayer`. Note that if you leave a key out, it is considered optional.

To enable the **subset check**, you will need to add the key-value pair
```
"@json" : false
```
to the root of each `dataLayer` *object* in the configuration file that you want to validate against.

Example:
```
{
    "baseUrl" : "https://www.yourdomain.com",
    "basePath" : "/",
    "dataLayerName" : "dataLayer",
    "dataLayer" : [{
        "@json" : false,
        "someVariable" : "someValue"
    },{
        "someOtherVariable" : {
            "type" : "number",
            "enum" : [1,2,3,4,5]
        }
    }]
}
```
Here the first object uses the subset check, so it will validate if the global `window.dataLayer` structure has at least one object with that exact key-value pair (`"someVariable" : "someValue"`) in the root.

The second object uses the modified JSON Schema. It will validate if at least one object in the global `window.dataLayer` structure has the root key `someOtherVariable` set to a number in the range of 1-5.

The JSON Schema used for the test configuration must follow the structure described in this README. When you run the tests, the JSON configuration is first validated against its own schema (`/lib/validTestConfSchema.json`). If validation fails, the test is aborted.

## Customize tests
The test is currently contained in `/examples/spec/`. There are two files:
* **basic_example.conf.json** - the JSON schema that controls on which pages the test visits and what assertations are run against `dataLayer`
* **basic_example.js** - the actual test specification
To customize the test, you should modify **basic_example.conf.json**. Here's what it might look like:
```
{
    "baseUrl" : "https://www.yourdomain.com",
    "basePath" : "/",
    "dataLayerName" : "dataLayer",
    "dataLayer" : [{
        "someVariable" : {
            "@rootRequired" : false,
            "type" : "object",
            "properties" : {
                "someDeeperVariable" : {
                    "pattern" : "^deepValue$"
                }
            },
            "required" : ["someDeeperVariable"]
        }
    }],
    "page" : [{
        "path" : "/some-path/",
        "dataLayer" : [{
            "@expect" : "dataLayer to have Enhanced Ecommerce detail object",
            "ecommerce" : {
                "type" : "object",
                "properties" : {
                    "detail" : {
                        "$ref" : "/enhancedEcommerceSchema.json#/definitions/detail"
                    }
                },
                "required" : ["detail"]
            }
        }]
    }]
}
```
These are all the keys you can currently use:

| Property | Type | Description |
| -------- | ---- | ----------- |
| baseUrl (*required*) | URI | Base URL for tests, no trailing /. |
| basePath (*required*)| String | Path for **global** dataLayer tests, remember the leading /. |
| multipleContainers | Boolean | If **true** then multiple instances of 'gtm.js' event are permitted in dataLayer. |
| dataLayerName | String | The name of the global `window.dataLayer` Array. Make sure this matches what you've configured in the Google Tag Manager container snippet. It defaults to `dataLayer`. |
| dataLayer | Array | **Global dataLayer configuration**. An Array of objects that you expect to find on every page of the site. The objects can be incomplete, as only the named key-value pairs will be searched for. |
| page | Array |  Array of **page-specific configurations**, where each object corresponds to a page you want to test. |
| page.path (*required*) | String |  Path of the page you want to test. |
| page.dataLayer (*required*) | Array | Array of objects, where each object is a single test run against `dataLayer`. Each object can have any number of key-value pairs, and only these key-value pairs are searched for (so the objects can be incomplete). The objects should correspond with what you expect to find in `dataLayer`. |
| page.dataLayer[].@expect (*required*) | String | A description of the test. It will be shown in the test reporter output. |
| (page.)dataLayer[].properties{}.key.@rootRequired | Boolean | If set to **false** will make this root-level property optional, meaning the test will pass even if the key is not found in the global `dataLayer` structure. |

If you use the **JSON Schema** option (by default), everything within the `dataLayer` objects (global and page-specific) must conform to the latest draft of JSON Schema (http://json-schema.org/). The only exceptions are:
* The root level of each `dataLayer` object is translated directly into properties of respective root level `window.dataLayer` objects. So instead of specifying the root level `dataLayer` objects in the configuration as complete JSON Schema objects, just list the properties as keys. Everything else (except for the other exceptions listed below) should be described using the regular JSON Schema specification.
* **@expect** used in the *page-specific* configurations to describe the current test for the test reporter. This is **required** also when using the **subset check** method.
* **@rootRequired** used in root-level properties to indicate whether or not they are optional in the global `dataLayer` structure.

## To do
* Add support for navigation (e.g. validate `dataLayer` after user interactions).
* Improve the configuration to make it easier to use different browser drivers.
