import { Module } from 'vuex'
import store from '@vue-storefront/core/store'
import RootState from '@vue-storefront/core/types/RootState'
import { isServer } from '@vue-storefront/core/helpers'

export const module: Module<any, RootState> = {
  namespaced: true,
  getters: {
    currentStoreView: (state, getters, rootState) => {
      return rootState.storeView
    },
    storeViews: () => {
      const { config } = store.state
      const stores = config.storeViews.mapStoreUrlsFor
      const { storeViews } = config
      return stores.map(store => storeViews[store])
    },
    isCurrent: (state, getters) => {
      if (isServer) {
        return true
      }
      return navigator.language === getters.currentStoreView.i18n.defaultLocale
    },
    saved: () => {
      if (isServer) {
        return undefined
      }
      const saved = localStorage.getItem('savedLocale')
      return saved || undefined
    },
    suggested: (state, getters) => {
      if (getters.isCurrent) {
        return getters.currentStoreView
      }
      return getters.storeViews.find(
        storeView => navigator.language === storeView.i18n.defaultLocale
      )
    },
  }
}
