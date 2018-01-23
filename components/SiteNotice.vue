<template lang="pug">
b-notification.site-notice(:active.sync="isVisible" v-if="html")
  wiki-html(:html="html")
</template>

<script>
import { mapState } from 'vuex'
import WikiHtml from '~/components/WikiHtml'

export default {
  components: {
    WikiHtml
  },
  computed: {
    ...mapState(['settings']),
    html () {
      return this.settings.data.siteNotice.html
    }
  },
  data () {
    return {
      isVisible: true
    }
  }
}
</script>

<style lang="scss">
@import '~assets/style-variables.scss';

.site-notice {
  background-color: $grey-lighter;
  margin-bottom: 1rem !important;
  @include touch {
    margin-bottom: 0.5rem !important;
  }
  .wiki-content {
    p {
      margin-bottom: 0;
    }
  }
}
</style>
