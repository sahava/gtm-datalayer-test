# gtm-datalayer-test
Automated functional testing for Google Tag Manager's Data Layer.

## Installation
1. Clone the repo with `git clone https://github.com/sahava/gtm-datalayer-test.git`
2. Run `npm install` to install the dependencies
3. Run `npm test` to run the test examples

## How it works
In `dataLayer.conf.json` (see below), you specify both global key-value pairs as well as page-specific configurations. These dataLayer compositions will then be searched on every page (global configuration) as well as on specific pages (page-specific configurations).

Currently the test looks for exact matches, so if you specify `"pageType" : "article"`, that exact key-value pair must exist in `dataLayer` for the test to pass.

If you specify multiple keys in a single configuration, all those keys must be found in the same object in the `dataLayer` object.
## Customize tests
The test is currently contained in `./test/dataLayer/`. There are two files:
* **dataLayer.conf.json** - the JSON schema that controls on which pages the test visits and what assertations are run against `dataLayer`
* **dataLayer.js** - the actual test specification
To customize the test, you should modify **dataLayer.conf.json**. Here's what it might look like:
```
{
    "baseUrl" : "https://www.yourdomain.com",
    "basePath" : "/",
    "dataLayerName" : "dataLayer",
    "dataLayer" : [{
        "someVariable" : "someValue"
    }],
    "page" : [{
        "path" : "/some-path/",
        "dataLayer" : [{
            "@expect" : "dataLayer to have basic article variables",
            "someSpecificVariable" : "someSpecificValue",
        }]
    }]
}
```
These are all the keys you can currently use:

| Property | Description |
| -------- | ----------- |
| baseUrl  | Base URL for tests, no trailing /. |
| basePath | Path for **global** dataLayer tests, remember the leading /. |
| dataLayerName | The name of the global `dataLayer` Array. Make sure this matches what you've configured in the Google Tag Manager container snippet. |
| dataLayer | **Global dataLayer configuration**. An Array of objects that you expect to find on every page of the site. The objects can be incomplete, as only the named key-value pairs will be searched for. |
| page | Array of **page-specific configurations**, where each object corresponds to a page you want to test. |
| page.path | Path of the page you want to test. |
| page.dataLayer | Array of objects, where each object is a single test run against `dataLayer`. Each object can have any number of key-value pairs, and only these key-value pairs are searched for (so the objects can be incomplete). The objects should correspond with what you expect to find in `dataLayer`. |
| page.dataLayer[].@expect | A description of the test. It will be shown in the test reporter output. |

## To do
* Instead of a fixed value, specify a **type** that the test runner looks for. Something like `"visitorLoginState" : "@string"`.
* Optional key-value pairs, where the idea is `IF key is in dataLayer THEN require it to have given value`, or even `IF key is in dataLayer THEN require it to have given value OR given type`.
* Improve the configuration to make it easier to use different browser drivers.
