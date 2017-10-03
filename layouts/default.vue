<template lang="pug">
layout
  nuxt
</template>

<script>
import { mapState } from 'vuex'
import Layout from '~/components/Layout'

export default {
  components: {
    Layout
  },
  computed: {
    ...mapState(['meta', 'settings'])
  },
  head () {
    return {
      title: this.meta.title || '',
      titleTemplate: `%s - ${this.settings.data.wikiName}`
    }
  }
}
</script>
