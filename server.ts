import appConfig from 'config'
import { serverHooks } from '@vue-storefront/core/server/hooks'

if (appConfig.storeViews.multistore) {
  serverHooks.afterApplicationInitialized(({ app }) => {
    const blacklist = ['__webpack_hmr']
    const storeCodes = appConfig.storeViews.mapStoreUrlsFor
    const defaultStoreCode = appConfig.storeViews.fallbackStoreCode || storeCodes[0]
    const blacklistStr = blacklist.join('|')
    const storeCodesStr = storeCodes.join('|')
    const hasStoreCode = new RegExp(
      `^((?!\\/(${storeCodesStr})(\\/|$))(?!\\/(${blacklistStr})$))\\/?.*((?<=\\.html)|(?<!\\.[a-zA-Z0-9]*))$`
    )

    let storeCode = defaultStoreCode

    app.get(hasStoreCode, (req, res) => {
      const { path } = req
      const cfIpCountry = <string>req.headers.http_cf_ipcountry
      const cfCountry = cfIpCountry ? cfIpCountry.toLowerCase() : undefined

      if (cfCountry) {
        // cfCountry matches existing storeView code...
        if (appConfig.storeViews[cfCountry] && appConfig.storeViews[cfCountry].disabled !== true) {
          storeCode = cfCountry
        }
        // ... otherwise check if cfCountry is mapped to a specific storeView...
        if (appConfig.storeViews.countryStoreViewMapping && appConfig.storeViews.countryStoreViewMapping[cfCountry]) {
          storeCode = appConfig.storeViews.countryStoreViewMapping[cfCountry]
        }
      }
      const newUrl = `/${storeCode}${path}`

      let query = ''
      if (Object.values(req.query).length > 0) {
        const params = new URLSearchParams(req.query)
        query += '?' + params.toString()
      }

      res.redirect(newUrl + query)

      console.log('Redirect to default:', newUrl)
    })
  })
}
