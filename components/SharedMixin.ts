import store from '@vue-storefront/core/store'
import { isServer } from '@vue-storefront/core/helpers'
import { mapGetters } from 'vuex'
import { localizedRoute, removeStoreCodeFromRoute } from '@vue-storefront/core/lib/multistore'
import get from 'lodash.get'
import StoryblokMixin from 'src/modules/vsf-storyblok-module/components/StoryblokMixin'
import config from 'config'
import CurrentPageMixin from './CurrentPageMixin'
import { findCategoryByPath } from '../findCategoryByPath'

export default {
  name: 'StorePickerMixin',
  mixins: [StoryblokMixin, CurrentPageMixin],
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
      if (url === '/' + this.current.storeCode) {
        url = '/'
      }

      // Are we on a Storyblok CMS page?
      if (this.isProductPage) {
        return this.localizedRoute(url, view).replace(/\/$/, "") + '?posterpage'
      }
      else if (this.isCategoryPage) {
        return this.localizedRoute(url, view).replace(/\/$/, "") + '?categorypage'
      }
      else if (this.isStoryblokPage && !this.story.full_slug.endsWith('/home')){
        // Try to find an alternate story for the target storeview
        let alternateStory = this.story.alternates.find((alternate) => {
          return alternate.full_slug.startsWith(view.storeCode + '/')
        })
        if(alternateStory){
          url = '/' + this.removeStoreCodeFromSlug(alternateStory.full_slug)
        }
      }

      return this.localizedRoute(url, view).replace(/\/$/, "")
    },
    localizedRoute(url, view) {
      if (config.baseUrl) {
        if (this.isAbsoluteUrl(view.url)) {
          return view.url + url
        } else {
          return config.baseUrl + localizedRoute(url, view.storeCode)
        }
      } else {
        return localizedRoute(url, view.storeCode)
      }
    },
    removeStoreCodeFromSlug(slug) {
      return slug.split(/\/(.+)/)[1]
    },
    goTo (view) {
      const route = this.getUrl(view)
      this.savePreference(view)
      window.location = route
    },
    savePreference ({storeCode}) {
      localStorage.setItem('savedLocale', storeCode)
    },
    isAbsoluteUrl (url) {
      return /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url)
    }
  }
}
