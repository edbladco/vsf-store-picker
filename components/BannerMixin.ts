import { mapGetters } from 'vuex'
import Mixin from './SharedMixin'

export default {
  name: 'BannerMixin',
  mixins: [Mixin],
  data () {
    return {
      closed: false
    }
  },
  computed: {
    ...mapGetters({
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
      this.goTo(this.suggested)
    },
    close () {
      this.closed = true
      this.savePreference(this.current)
    }
  }
}
