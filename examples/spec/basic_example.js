// Set the filename in require() to point to this test's configuration JSON
const dataLayerConf = require('./basic_example.conf.json')

const testUtils = require('../../lib/testUtils')
const getWindowDataLayer = testUtils.getWindowDataLayer
const getJsonSchema = testUtils.getJsonSchema
const dataLayerName = dataLayerConf.dataLayerName || 'dataLayer'

testUtils.validate(dataLayerConf)

describe('Testing Google Tag Manager\'s dataLayer composition on ' + dataLayerConf.baseUrl, () => {

    dataLayerConf.page.forEach(testPage => {

        context('navigating to page ' + testPage.path, () => {

            context('running generic dataLayer tests', () => {

                before(() =>
                    browser.url(dataLayerConf.baseUrl + testPage.path).waitForVisible('body', 5000)
                )

                it('expect dataLayer to be an Array', () =>
                    expect(getWindowDataLayer(dataLayerName)).to.be.an('Array')
                )

                it('expect dataLayer to have the gtm.js event', () => {
                    const objectsWithGtmJs = getWindowDataLayer(dataLayerName).filter(o => o.event === 'gtm.js')
                    if (!dataLayerConf.multipleContainers) {
                        assert.lengthOf(objectsWithGtmJs, 1, "dataLayer should have exactly one gtm.js event")
                    } else {
                        assert.isAtLeast(objectsWithGtmJs.length, 1, "dataLayer should have at least one gtm.js event")
                    }
                })

                it('expect dataLayer to have globally defined keys', () => {
                    dataLayerConf.dataLayer.forEach(dlObj => {
                        if (dlObj['@json'] === false) {
                            delete dlObj['@json']
                            assert.containSubset(getWindowDataLayer(dataLayerName), [dlObj], 'FAILED ON: ' + JSON.stringify(dlObj), null, 2)
                        } else {
                            assert.jsonSchema(
                                getWindowDataLayer(dataLayerName),
                                getJsonSchema(dlObj),
                                'FAILED ON: ' + JSON.stringify(dlObj, null, 2)
                            )
                        }
                    })
                })
            })

            context('running page-specific tests', () => {
                before(() =>
                    browser.url(dataLayerConf.baseUrl + testPage.path).waitForVisible('body', 5000)
                )

                testPage.dataLayer.forEach(dlObj => {
                    it('expect ' + dlObj['@expect'], () => {
                        delete dlObj['@expect']
                        if (dlObj['@json'] === false) {
                            delete dlObj['@json']
                            assert.containSubset(getWindowDataLayer(dataLayerName), [dlObj], 'FAILED ON: ' + JSON.stringify(dlObj), null, 2)
                        } else {
                            assert.jsonSchema(
                                getWindowDataLayer(dataLayerName),
                                getJsonSchema(dlObj),
                                'FAILED ON: ' + JSON.stringify(dlObj, null, 2)
                            )
                        }
                    })
                })

            })

        })

    })

})