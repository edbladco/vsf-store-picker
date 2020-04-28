import { module } from './store'
import { VueStorefrontModule, VueStorefrontModuleConfig } from '@vue-storefront/core/lib/module'
import { initCacheStorage } from '@vue-storefront/core/lib/storage-manager'

export const KEY = 'store-picker'

export const cacheStorage = initCacheStorage(KEY)

export { forceStorecode } from './forceStorecode'
export { findCategoryByPath } from './findCategoryByPath'

const moduleConfig: VueStorefrontModuleConfig = {
  key: KEY,
  store: { modules: [{ key: KEY, module }] }
}

export const StorePicker = new VueStorefrontModule(moduleConfig)
