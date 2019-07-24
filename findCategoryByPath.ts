import { storeCodeFromRoute, removeStoreCodeFromRoute } from '@vue-storefront/core/lib/multistore'
import store from '@vue-storefront/core/store'
import { isServer } from '@vue-storefront/core/helpers'
import Vue from 'vue'
import fetch from 'isomorphic-fetch'

// Use with https://github.com/kodbruket/vsf-mapping-fallback
/*
 * Config example:
  "storePicker": {
    "categoryByPath": "http://localhost:3000/api/ext/vsf-store-picker/categoryByPath?path={{path}}"
  },
 */
export const findCategoryByPath = async (context, { url }) => {
  const {config} = store.state
  const storeCode = storeCodeFromRoute(url)
  const category = (removeStoreCodeFromRoute(url) as string)
  if (category && config.storeViews.multistore && config.storePicker && config.storePicker.categoryByPath) {
    const categoryUrl = config.storePicker.categoryByPath.replace('{{path}}', category)
    const response = await fetch(categoryUrl, {
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors'
    })
    const {result} = await response.json()
    const categorySlug = result.url_paths && result.url_paths[storeCode]
    if (categorySlug) {
      if (isServer) {
        const path = `/${storeCode}/${categorySlug}`
        const { response: res } = Vue.prototype.$ssrRequestContext.server
        return res.redirect(path)
      } else {
        return {
          name: 'category',
          params: {
            slug: categorySlug
          }
        }
      }
    }
  }
}
