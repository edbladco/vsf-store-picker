import { Module } from 'vuex'
import store from '@vue-storefront/core/store'
import RootState from '@vue-storefront/core/types/RootState'
import { isServer } from '@vue-storefront/core/helpers'
import filter from 'lodash-es/filter'

export const module: Module<any, RootState> = {
  namespaced: true,
  getters: {
    currentStoreView: (state, getters, rootState) => {
      return rootState.storeView
    },
    storeViews: () => {
      const { config } = store.state
      return filter(config.storeViews, prop => prop.hasOwnProperty('storeCode') && prop.disabled === false)
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
