const enhancedEcommerceSchema = require('../lib/enhancedEcommerceSchema.json')
const isWin = /^win/.test(process.platform);
var phantomjsBinaryPath = './node_modules/.bin/phantomjs';
if(isWin)
	phantomjsBinaryPath = './node_modules/.bin/phantomjs.cmd';
	
exports.config = {
    specs: [
        './examples/spec/basic_example.js'
    ],
    maxInstances: 10,
    capabilities: [{
        maxInstances: 5,
        browserName: 'phantomjs',
        'phantomjs.binary.path': phantomjsBinaryPath
    }],
    sync: true,
    logLevel: 'silent',
    coloredLogs: true,
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    services: ['selenium-standalone'],
    seleniumInstallArgs: {
        version: '3.0.1'
    },
    seleniumArgs: {
        version: '3.0.1'
    },
	seleniumLogs: "sellogs/",
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
