import store from '@vue-storefront/core/store'
import { isServer } from '@vue-storefront/core/helpers'
import { mapGetters } from 'vuex'
import { localizedRoute, removeStoreCodeFromRoute, storeCodeFromRoute } from '@vue-storefront/core/lib/multistore'
import get from 'lodash.get'
import StoryblokMixin from 'src/modules/vsf-storyblok-module/components/StoryblokMixin'

export default {
  name: 'StorePickerMixin',
  mixins: [StoryblokMixin],
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

      // Are we on a Storyblok CMS page?
      if(this.story){
        // Try to find an alternate story for the target storeview
        let alternateStory = this.story.alternates.find((alternate) => {
          return storeCodeFromRoute(alternate.full_slug) === view.storeCode
        })
        if(alternateStory){
          url = '/' + removeStoreCodeFromRoute(alternateStory.full_slug)
        }
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
