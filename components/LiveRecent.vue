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
      background-color: #fff;
      border-bottom: 2px solid $primary;
    }
  }
  .live-recent-content {
    background-color: #fff;
  }
  .live-recent-footer {
    justify-content: flex-end;
    background-color: $background;
    border-bottom-left-radius: $radius;
    border-bottom-right-radius: $radius;
  }
  // .live-recent-item {
  //   a {
  //     color: #373a3c;
  //   }
  // }
  //
  // .live-recent-spinner {
  //   float: left;
  // }
  //
  // .live-recent-header .nav {
  //   border: 0;
  // }
  //
  // .live-recent-header .nav .nav-item {
  //   width: 7.5rem;
  //   border: 1px solid #e1e8ed;
  //   border-top-left-radius: 0.35rem;
  //   background-color: #f5f8fa;
  // }
  //
  // .live-recent-header .nav .nav-item+.nav-item {
  //   margin-left: 0;
  //   border-left: 0;
  //   border-top-left-radius: 0;
  //   border-top-right-radius: 0.35rem;
  // }
  //
  // .live-recent-header .nav .nav-item .nav-link {
  //   border: 0;
  //   border-radius: 0;
  //   border-top-left-radius: 0.35rem;
  //   text-align: center;
  //   padding-top: 0.6rem;
  //   padding-bottom: 0.6rem;
  //   color: #6e7478;
  //   position: relative;
  //   &.active,
  //   &:active,
  //   &:hover,
  //   &:focus {
  //     color: #373a3c;
  //     background-color: #fff;
  //     &::before {
  //       position: absolute;
  //       left: -1px;
  //       bottom: -1px;
  //       content: " ";
  //       width: 7.5rem;
  //       display: block;
  //       border-bottom: 2px solid #4188f1;
  //     }
  //   }
  // }
  //
  // .live-recent-header .nav .nav-item+.nav-item .nav-link {
  //   border-top-left-radius: 0;
  //   border-top-right-radius: 0.35rem;
  // }
  //
  // .live-recent-content {
  //   background-color: #fff;
  //   border: 1px solid #e1e8ed;
  //   border-top: 0;
  // }
  //
  // .live-recent-content .live-recent-list {
  //   list-style: none;
  //   padding: 0;
  //   margin: 0;
  // }
  //
  // .live-recent-content .live-recent-list li {
  //   border-bottom: 1px solid #e1e8ed;
  //   padding: 0.2rem 0.6rem;
  // }
  //
  // .live-recent-content .live-recent-list li:last-child {
  //   border-bottom: none;
  // }
  //
  // .live-recent-content .live-recent-list .recent-item {
  //   font-size: 0.85rem;
  //   color: #373a3c;
  // }
  //
  // .live-recent-content .live-recent-list .recent-item .new {
  //   font-size: 0.85rem;
  //   color: #b73333;
  // }
  //
  // .live-recent-footer {
  //   background-color: #f5f8fa;
  //   border: 1px solid #e1e8ed;
  //   border-top: 0;
  //   border-bottom-left-radius: 0.35rem;
  //   border-bottom-right-radius: 0.35rem;
  //   text-align: right;
  //   padding: 0.4rem 0.6rem;
  // }
  //
  // .live-recent-footer .label {
  //   color: #fff;
  //   background-color: #5997f3;
  //   padding: 0.4rem;
  //   font-size: 0.8rem;
  //   font-weight: 400;
  // }
  //
  // .live-recent-footer .label:hover {
  //   background-color: #2979f0;
  //   transition: 0.3s;
  // }
}
</style>
