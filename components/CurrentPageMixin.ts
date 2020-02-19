import { isServer } from '@vue-storefront/core/helpers'
import { RouterManager } from '@vue-storefront/core/lib/router-manager'

export default {
  data () {
    return {
      currentRouteComponent: null
    }
  },
  watch: {
    '$route.name': function () {
      this.setCurrentPage()
    }
  },
  computed: {
    canGoBack () {
      return !this.isHistoryEmpty() && this.isProductPage
    },
    isProductPage () {
      return this.currentRouteComponent == 'Product'
    },
    isCategoryPage () {
      return this.currentRouteComponent == 'Category'
    },
    isStoryblokPage () {
      return this.currentRouteComponent == 'StoryblokPage'
    },
    isCheckoutPage () {
      return this.currentRouteComponent == 'Checkout'
    },
  },
  created () {
    this.setCurrentPage()
  },
  methods: {
    setCurrentPage () {
      const route = RouterManager.findByName(this.$route.name)
      this.currentRouteComponent = route && route.component && route.component.name
    },
    // Check if history is empty
    isHistoryEmpty () {
      if (!isServer) {
        return window.history.length <= 1
      }

      return false
    }
  }
}
