# vsf-store-picker

A collection of multistore helpers

### `components/BannerMixin.ts`

Show a banner to switch storeView based on `navigator.language`

#### Example

```html
<template>
  <div>
    <no-ssr>
      <div class="banner" v-if="showBanner && suggested">
        <div class="container">
          <span>
            {{ $t(`We've detected another language, do you want to switch?`) }}
          </span>
          <button data-testid="switchCountry" @click="goToSuggested">
            {{ $t(`Go to ${suggested.i18n.fullLanguageName}`) }}
          </button>
          <button data-testid="chooseCountry" @click="close">
            {{ $t(`Stay ${current.i18n.fullLanguageName}`) }}
          </button>
        </div>
      </div>
    </no-ssr>
  </div>
</template>

<script>
import NoSSR from 'vue-no-ssr'
import BannerMixin from 'src/modules/vsf-store-picker/components/BannerMixin'
export default {
  mixins: [BannerMixin],
  components: {
    'no-ssr': NoSSR
  }
}
</script>
```

### `components/SwitcherMixin.ts`

Used to create a storeView switcher

#### Example

```html
<template>
  <select @change="onChange($event)">
    <option
      v-for="(view, key) in storeViews"
      :key="key"
      :value="key"
      :selected="view.url === current.url"
    >
      {{ view.name }}
    </option>
  </select>
</template>

<script>
import SwitcherMixin from './SwitcherMixin'
export default {
  mixins: [SwitcherMixin],
  methods: {
    onChange (event) {
      const view = this.storeViews[event.target.value]
      if (view) {
        this.goTo(view)
      }
    }
  }
}
</script>
```

### `forceStorecode.ts`

To be used with [vsf-mapping-fallback](https://github.com/kodbruket/vsf-store-picker)

If activated this forces visitors to end up on a URL with a storecode. For example `www.example.com/foo` would be redirected to `www.example.com/STORECODE/foo`.

Order of processing storecode:

1. Is the `HTTP_CF_IPCOUNTRY` header present?
    1. Does any storeView match `HTTP_CF_IPCOUNTRY`?
    2. Does the `countryStoreViewMapping` match `HTTP_CF_IPCOUNTRY`?
2. Is `storeView.fallbackStoreCode` defined?
3. Is *any* storeView available?

#### Example

```js
import { extendMappingFallback } from './vsf-mapping-fallback'
import { forProduct, forCategory, tap } from './vsf-mapping-fallback/builtin'
import { forceStorecode } from './vsf-store-picker'

extendMappingFallback(
  forceStorecode, forProduct, forCategory, tap
)
```

### Config

```json
{
  "storeViews": {
    "multistore": true,
    "countryStoreViewMapping": {
      "ca": "us", // canada to us store
      "be": "de",
      "at": "de"
    },
    "fallbackStoreCode": "en", // if no match is found
    "forcePrefix": true, // toggle functionality
    ...
  }
}
```
