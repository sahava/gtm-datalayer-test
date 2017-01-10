const dataLayerConf = require('./dataLayer.conf.json');
const dataLayerName = dataLayerConf.dataLayerName;

const getWindowDataLayer = () => browser
  .execute(function(dataLayerName) { return window[dataLayerName] }, dataLayerName)
  .value

describe('Testing Google Tag Manager\'s dataLayer composition on ' + dataLayerConf.baseUrl, () => {

    context('with generic tests', () => {

        context('on page ' + dataLayerConf.basePath, () => {

            before(() =>
              browser.url(dataLayerConf.baseUrl).waitForVisible('body', 5000)
            )

            it('expect dataLayer to be an Array', () =>
              expect(getWindowDataLayer()).to.be.an('Array')
            )

            it('expect dataLayer to have one gtm.js event', () => {
                const objectsWithGtmJs = getWindowDataLayer().filter((o) => o.event === 'gtm.js')
                expect(objectsWithGtmJs).to.have.lengthOf(1)
            })

            it('expect dataLayer to have globally defined keys', () => {
                dataLayerConf.dataLayer.forEach(dlObj => assert.containSubset(getWindowDataLayer(), [dlObj]))
            })
        })

    })

    context('with custom tests', () => {

        dataLayerConf.page.forEach(testPage => {

            context('on page ' + testPage.path, () => {

                before(() => browser.url(dataLayerConf.baseUrl + testPage.path).waitForVisible('body', 5000))

                testPage.dataLayer.forEach(dlObj => {
                    it('expect ' + dlObj['@expect'], () => {
                        delete dlObj['@expect']
                        assert.containSubset(getWindowDataLayer(), [dlObj], JSON.stringify(dlObj))
                    })
                })

            })

        })

    })

})