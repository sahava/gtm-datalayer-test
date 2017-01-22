const enhancedEcommerceSchema = require('./lib/enhancedEcommerceSchema.json')
exports.config = {
    specs: [
        './spec/**/*.js'
    ],
    maxInstances: 10,
    capabilities: [{
        maxInstances: 5,
        browserName: 'phantomjs'
    }],
    sync: true,
    logLevel: 'silent',
    coloredLogs: true,
    bail: 0,
    screenshotPath: './errorShots/',
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
