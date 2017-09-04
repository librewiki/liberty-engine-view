<template lang="pug">
b-notification.site-notice(:active.sync="isVisible" type="is-primary")
  wiki-html(:html="notice")
</template>

<script>
import WikiHtml from '~/components/WikiHtml'
import request from '~/utils/request'

export default {
  components: {
    WikiHtml
  },
  data () {
    return {
      isVisible: false,
      notice: ''
    }
  },
  methods: {
    async fetch () {
      const resp = await request({ method: 'get', path: 'site-notice' })
      this.notice = resp.data.siteNotice.html
      if (this.notice) {
        this.isVisible = true
      } else {
        this.isVisible = false
      }
    }
  },
  created () {
    this.fetch()
    clearInterval(this.fetch)
    setInterval(this.fetch, 1000 * 60 * 10)
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
