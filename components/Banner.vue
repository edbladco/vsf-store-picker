<template>
  <div>
    <div class="banner" v-if="showBanner">
      <div class="container">
        <span>
          {{ $t(`We've detected another language, do you want to switch?`) }}
        </span>
        <div>
          <button data-testid="switchCountry" @click="goToSuggested">
            {{ $t(`Go to ${suggested.i18n.fullLanguageName}`) }}
          </button>
          <button data-testid="chooseCountry" @click="close">
            {{ $t(`Stay ${current.i18n.fullLanguageName}`) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BannerMixin from './BannerMixin'
export default {
  mixins: [BannerMixin]
}
</script>

<style lang="scss" scoped>
  .banner {
    background: #ddd;
  }
  .container {
    align-items: center;
    padding: 20;
  }
</style>
