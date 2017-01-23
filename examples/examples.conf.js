const enhancedEcommerceSchema = require('../lib/enhancedEcommerceSchema.json')
exports.config = {
    specs: [
        './examples/spec/basic_example.js'
    ],
    maxInstances: 10,
    capabilities: [{
        maxInstances: 5,
        browserName: 'phantomjs',
        'phantomjs.binary.path': './node_modules/phantomjs-prebuilt/bin/phantomjs'
    }],
    sync: true,
    logLevel: 'silent',
    coloredLogs: true,
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    services: ['selenium-standalone'],
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd'
    },
    before: function() {
        const chai = require('chai');
        chai.use(require('chai-json-schema'))
        chai.use(require('chai-subset'))
        chai.tv4.addSchema('/enhancedEcommerceSchema.json', enhancedEcommerceSchema)
        global.expect = chai.expect
        global.assert = chai.assert
    }
}
