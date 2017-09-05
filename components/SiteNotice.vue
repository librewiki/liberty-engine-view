<template lang="pug">
b-notification.site-notice(:active.sync="isVisible" type="is-primary")
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
.site-notice {
  .wiki-content {
    p {
      margin-bottom: 0;
    }
  }
}
</style>
