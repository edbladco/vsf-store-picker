import { isServer } from '@vue-storefront/core/helpers'
import { RouterManager } from '@vue-storefront/core/lib/router-manager'

export default {
  data () {
    return {
      currentRouteComponentName: null
    }
  },
  watch: {
    '$route': function () {
      this.setCurrentPage()
    }
  },
  computed: {
    isProductPage () {
      return this.currentRouteComponentName == 'Product'
    },
    isCategoryPage () {
      return this.currentRouteComponentName == 'Category'
    },
    isStoryblokPage () {
      return this.currentRouteComponentName == 'StoryblokPage'
    },
    isCheckoutPage () {
      return this.currentRouteComponentName == 'Checkout'
    },
  },
  created () {
    this.setCurrentPage()
  },
  methods: {
    setCurrentPage () {
      const route = RouterManager.findByName(this.$route.name)
      console.log({pageType: route.component.name})
      this.currentRouteComponentName = route && route.component && route.component.name
    }
  }
}
