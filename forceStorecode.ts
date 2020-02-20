import storeCodeFromRoute from '@vue-storefront/core/lib/storeCodeFromRoute'
import store from '@vue-storefront/core/store'
import { isServer } from '@vue-storefront/core/helpers'
import Vue from 'vue'

// Use with https://github.com/kodbruket/vsf-mapping-fallback
export const forceStorecode = async (context, { url }) => {

  if (isServer) {
    const { request: req, response: res } = Vue.prototype.$ssrRequestContext.server
    if (url.startsWith('dist/')) {
      return res.status(404).send('Not found')
    }
    if (req.headers['x-vs-store-code']) {
      return
    }
    const { storeViews } = store.state.config
    const storeCode = storeCodeFromRoute(url)
    const queryString = Object.keys(req.query).map(key => key + '=' + req.query[key]).join('&');
    if (storeViews.multistore && storeViews.forcePrefix && !storeCode) {
      const redirect = url => {
        const statusCode = storeViews.redirectStatusCode || 302
        if (queryString) {
          url = url + '?' + queryString
        }
        res.set('location', url)
        res.status(statusCode).send()
      }
      const createUrl = (_storeCode: string) => `/${_storeCode}${url}`

      const cfCountry = req.headers.http_cf_ipcountry ? req.headers.http_cf_ipcountry.toLowerCase() : undefined
      if (cfCountry) {
        // cfCountry matches existing storeView code...
        if (storeViews[cfCountry] && storeViews[cfCountry].disabled !== true) {
          let newUrl = createUrl(cfCountry)
          return redirect(newUrl)
        }
        // ...otherwise check if cfCountry is mapped to a specific storeView...
        if (storeViews.countryStoreViewMapping && storeViews.countryStoreViewMapping[cfCountry]){
          let newUrl = createUrl(storeViews.countryStoreViewMapping[cfCountry])
          return redirect(newUrl)
        }
      }
      // ...otherwise check if a single fallback storeview is configured (ie our default storeView)
      if (storeViews.fallbackStoreCode) {
        let newUrl = createUrl(storeViews.fallbackStoreCode)
        return redirect(newUrl)
      }
      // ...we have nothing to go on. Just pick any available storeview.
      const lastResort: any = Object.values(storeViews)
        .find((view: any) => view && view.storeCode && !view.disabled)
      let newUrl = createUrl(lastResort.storeCode)
      return redirect(newUrl)
    }
  }
}
