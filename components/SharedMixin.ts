import store from '@vue-storefront/core/store'
import { isServer } from '@vue-storefront/core/helpers'
import { mapGetters } from 'vuex'
import { localizedRoute, removeStoreCodeFromRoute } from '@vue-storefront/core/lib/multistore'

export default {
  name: 'StorePickerMixin',
  computed: {
    ...mapGetters({
      current: 'store-picker/currentStoreView',
      storeViews: 'store-picker/storeViews',
    })
  },
  methods: {
    getUrl (view) {
      const url = removeStoreCodeFromRoute(window.location.pathname)
      const route = localizedRoute(url, view.storeCode)
      return route
    },
    goTo (view) {
      const route = this.getUrl(view)
      this.savePreference(view)
      window.location = route
    },
    savePreference ({storeCode}) {
      localStorage.setItem('savedLocale', storeCode)
    }
  }
}
