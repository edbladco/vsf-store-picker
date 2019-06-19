import store from '@vue-storefront/core/store'
import { isServer } from '@vue-storefront/core/helpers'
import { mapGetters } from 'vuex'
import { localizedRoute, removeStoreCodeFromRoute } from '@vue-storefront/core/lib/multistore'
import get from 'lodash.get'

export default {
  name: 'StorePickerMixin',
  computed: {
    ...mapGetters({
      current: 'store-picker/currentStoreView',
      storeViews: 'store-picker/storeViews',
    })
  },
  methods: {
    getUrl (view): string {
      if (isServer) {
        return ''
      }
      const pathname = get(window, 'location.pathname', '')
      let url = removeStoreCodeFromRoute(pathname)
      if (url === pathname) {
        url = '/'
      }
      const route = localizedRoute(url, view.storeCode)
      return route.replace(/\/$/, "")
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
