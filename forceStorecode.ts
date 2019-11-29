import { storeCodeFromRoute } from '@vue-storefront/core/lib/multistore'
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
    if (storeViews.multistore && storeViews.forcePrefix && !storeCode) {
      const createUrl = (_storeCode: string) => `/${_storeCode}/${url}`
      const cfCountry = req.headers.http_cf_ipcountry ? req.headers.http_cf_ipcountry.toLowerCase() : undefined
      // cfCountry matches existing storeView code...
      if (cfCountry && storeViews[cfCountry] && storeViews[cfCountry].disabled !== true) {
        const newUrl = createUrl(cfCountry)
        return res.redirect(newUrl)
      }
      // ...otherwise check if cfCountry is mapped to a specific storeView...
      if(cfCountry && storeViews.countryStoreViewMapping && storeViews.countryStoreViewMapping[cfCountry]){
        const newUrl = createUrl(storeViews.countryStoreViewMapping[cfCountry])
        return res.redirect(newUrl)
      }
      // ...otherwise check if a single fallback storeview is configured (ie our default storeView)
      if (storeViews.fallbackStoreCode) {
        const newUrl = createUrl(storeViews.fallbackStoreCode)
        return res.redirect(newUrl)
      }
      // ...we have nothing to go on. Just pick any available storeview.
      const lastResort: any = Object.values(storeViews)
        .find((view: any) => view && view.storeCode && !view.disabled)
      const newUrl = createUrl(lastResort.storeCode)
      return res.redirect(newUrl)
    }
  }
}
