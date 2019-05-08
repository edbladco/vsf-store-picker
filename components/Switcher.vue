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
import SwitcherMixin from 'src/modules/store-picker/components/SwitcherMixin'
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
