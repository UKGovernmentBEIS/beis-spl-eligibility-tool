const pa11y = require('pa11y')
const puppeteer = require('puppeteer')
const { expect } = require('chai')
const paths = require('app/paths.js')
const pa11yConfig = {
  includeWarnings: true,
  ignore: ['notice', 'WCAG2AA.Principle1.Guideline1_3.1_3_1.F92,ARIA4'],
  chromeLaunchConfig: { ignoreHTTPSErrors: true },
  hideElements: '',
  page: undefined,
  browser: undefined
}
const pathsToIgnore = []
const errorTitles = ['Page not found', 'Service unavailable']

/* global describe before it */

describe('Accessibility checking eligibility tool', function () {
  before('start service', async () => {
    const browser = await startBrowser()
    const page = await browser.newPage()
    pa11yConfig.browser = browser
    pa11yConfig.page = page
  })
  async function startBrowser () {
    const args = ['--no-sandbox', '--start-maximized', '--ignore-certificate-errors']
    const opts = {
      args,
      headless: true,
      timeout: 20000,
      ignoreHTTPSErrors: true
    }
    const browser = await puppeteer.launch(opts)
    // If browser crashes try to reconnect
    browser.on('disconnected', startBrowser)
    return browser
  }

  it('checking pages for accessiblity issues', async function () {
    this.timeout(50000)
    const errors = await checkPath(paths, [])
    expect(errors).to.eql([])
  })

  async function checkPath (pathsToCheck, errors) {
    for (const path of Object.values(pathsToCheck)) {
      if (typeof path === 'string') {
        if (pathsToIgnore.indexOf(path) === -1) {
          console.log(`Checking accessibility for [${path}]`)
          const result = await pa11y(`http://localhost:3000${path}`, pa11yConfig)
          console.log('error results are....', result)
          if (result.issues.length > 0 || errorTitles.some(title => result.documentTitle.includes(title))) {
            errors.push(result)
          }
        }
      } else {
        errors = await checkPath(path, errors)
      }
    }
    return errors
  }
})
