exports.config = {
    specs: [
        './test/dataLayer/**/*.js'
    ],
    exclude: [
        // 'path/to/excluded/files'
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
        var chai = require('chai');
        var chaiSubset = require('chai-subset');
        chai.use(chaiSubset);
        global.expect = chai.expect;
        global.assert = chai.assert;
    }
};
