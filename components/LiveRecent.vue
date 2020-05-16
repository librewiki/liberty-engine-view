<template lang="pug">
nav.panel.live-recent
  .live-recent-header
    .tabs.is-toggle.is-fullwidth
      ul
        li
          a(:class="{ 'is-active': mode === 'ARTICLE' }" @click="mode = 'ARTICLE'; fetchLiveRecent()" role="button") 최근바뀜
        li
          a(:class="{ 'is-active': mode === 'DISCUSSION' }" @click="mode = 'DISCUSSION'; fetchLiveRecent()" role="button") 최근토의
  .live-recent-content
    nuxt-link.panel-block(v-for="item in items" :to="item.to" :key="item.key")
      span.live-recent-time [{{ item.timeString }}]&nbsp;
      span.live-recent-tag(v-if="item.isNew") [New]&nbsp;
      span.live-recent-title {{item.text}}
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
        if (this.mode === 'ARTICLE') {
          const resp = await request({
            method: 'get',
            path: 'articles',
            query: {
              limit: 10,
              order: 'updatedAt'
            }
          })
          this.items = resp.data.articles.map(article => {
            let timeString
            if (this.$moment(article.updatedAt) < this.$moment().subtract(1, 'day')) {
              timeString = this.$moment(article.updatedAt).fromNow()
            } else {
              timeString = this.$moment(article.updatedAt).format('HH[:]mm[:]ss')
            }
            const isNew = article.createdAt === article.updatedAt
            return {
              key: 'a' + article.id,
              timeString,
              isNew,
              text: article.fullTitle,
              to: `/article/${encodeURIComponent(article.fullTitle)}`
            }
          })
        } else {
          const resp = await request({
            method: 'get',
            path: 'discussion-topics',
            query: {
              limit: 10,
              order: 'updatedAt'
            }
          })
          this.items = resp.data.discussionTopics.map(topic => {
            let timeString
            if (this.$moment(topic.updatedAt) < this.$moment().subtract(1, 'day')) {
              timeString = this.$moment(topic.updatedAt).fromNow()
            } else {
              timeString = this.$moment(topic.updatedAt).format('HH[:]mm[:]ss')
            }
            return {
              key: 't' + topic.id,
              timeString,
              text: topic.article.fullTitle,
              to: `/discussion/${topic.id}`
            }
          })
        }
        this.pending = false
        this.error = false
      } catch (err) {
        this.error = true
        this.pending = false
      }
    }
  },
  mounted () {
    this.$eventHub.$on('reload-live-recent', this.fetchLiveRecent)
    this.fetchLiveRecent()
    clearInterval(this.fetchLiveRecent)
    setInterval(this.fetchLiveRecent, 30 * 1000)
  },
  beforeDestroy () {
    this.$eventHub.$off('reload-live-recent', this.fetchLiveRecent)
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
      border-bottom: 0 !important;
    }
    .is-active {
      background-color: white;
      border-bottom: 2px solid $primary !important;
    }
  }
  .live-recent-content {
    background-color: white;
  }
  .live-recent-tag {
    color: #b73333;
  }
  .live-recent-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .live-recent-footer {
    justify-content: flex-end;
    background-color: $background;
    border-bottom-left-radius: $radius;
    border-bottom-right-radius: $radius;
  }
}
</style>
