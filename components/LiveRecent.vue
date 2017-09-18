<template lang="pug">
nav.panel.live-recent
  .live-recent-header
    .tabs.is-toggle.is-fullwidth
      ul
        li
          a.is-active 최근바뀜
        li
          a 최근토론
  .live-recent-content
    nuxt-link.panel-block(v-for="item in items" :to="`/article/${encodeURIComponent(item.fullTitle)}`" :key="item.key")
      | [{{ item.timeString }}] {{ item.fullTitle }}
  .live-recent-footer.panel-block
    nuxt-link.button.is-primary.is-small(to="/recent-changes" title="최근 바뀜") 더보기
</template>

<script>
import request from '~/utils/request'

export default {
  data () {
    return {
      error: false,
      pending: false,
      items: [],
      mode: 'ARTICLE'
    }
  },
  methods: {
    async fetchLiveRecent () {
      if (window.innerWidth < 769) return
      if (this.pending) return
      this.pending = true
      try {
        const resp = await request({
          method: 'get',
          path: 'revisions?limit=10&distinct=1'
        })
        this.items = resp.data.revisions.map(rev => ({
          key: rev.id,
          timeString: this.$moment(rev.createdAt).format('HH[:]mm[:]ss'),
          fullTitle: rev.articleFullTitle
        }))
        this.pending = false
        this.error = false
      } catch (err) {
        this.error = true
        this.pending = false
      }
    }
  },
  mounted () {
    this.fetchLiveRecent()
    clearInterval(this.fetchLiveRecent)
    setInterval(this.fetchLiveRecent, 30 * 1000)
  }
}
</script>

<style lang="scss">
@import '~assets/style-variables.scss';

.live-recent {
  width: 15rem;
  .live-recent-header {
    background-color: $background;
    a {
      padding: 0.6rem;
      border-bottom-right-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
      border-bottom: 0;
    }
    .is-active {
      background-color: white;
      border-bottom: 2px solid $primary;
    }
  }
  .live-recent-content {
    background-color: white;
  }
  .live-recent-footer {
    justify-content: flex-end;
    background-color: $background;
    border-bottom-left-radius: $radius;
    border-bottom-right-radius: $radius;
  }
}
</style>
