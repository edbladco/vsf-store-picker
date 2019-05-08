import store from '@vue-storefront/core/store'
import { isServer } from '@vue-storefront/core/helpers'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      closed: false
    }
  },
  computed: {
    ...mapGetters({
      current: 'store-picker/currentStoreView',
      storeViews: 'store-picker/storeViews',
      isCurrent: 'store-picker/isCurrent',
      saved: 'store-picker/saved',
      suggested: 'store-picker/suggested'
    }),
    showBanner () {
      const isSaved = this.saved && this.saved === this.current.storeCode
      return !this.closed && !this.isCurrent && !isSaved
    }
  },
  watch: {
    '$route' () {
      this.close()
    }
  },
  methods: {
    goToSuggested () {
      this.savePreference(this.suggested)
      window.location = this.suggested.url
    },
    close () {
      this.closed = true
      this.savePreference(this.current)
    },
    savePreference ({storeCode}) {
      localStorage.setItem('savedLocale', storeCode)
    }
  }
}
