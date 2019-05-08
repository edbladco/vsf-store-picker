import store from '@vue-storefront/core/store'
import { isServer } from '@vue-storefront/core/helpers'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      current: 'store-picker/currentStoreView',
      storeViews: 'store-picker/storeViews',
    })
  },
  methods: {
    goTo (view) {
      this.savePreference(view)
      window.location = view.url
    },
    savePreference ({storeCode}) {
      localStorage.setItem('savedLocale', storeCode)
    }
  }
}
