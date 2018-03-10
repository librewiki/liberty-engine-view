<template lang="pug">
.card.discussion-comment-card
  header.card-header
    .comment-info
      .comment-author {{ comment.authorName || comment.ipAddress }}
      .comment-date {{ $moment(comment.createdAt).format('LLLL') }}
    .comment-admin(v-if="user.specialPermissions.includes('SET_DISCUSSION_STATUS')")
      b-dropdown(position="is-bottom-left")
        button.button.is-small(slot="trigger")
          span 관리
          b-icon(icon="caret-down")
        b-dropdown-item(@click="hide" v-if="comment.status === 'PUBLIC'") 이 코멘트 숨기기
        b-dropdown-item(@click="unhide" v-else) 이 코멘트 숨김 해제
  .card-content(:class="{ 'hidden-comment': comment.status === 'HIDDEN' }")
    wiki-html(v-if="comment.status === 'PUBLIC'" :html="comment.html")
    div(v-else) 이 코멘트는
      = ' '
      nuxt-link(:to="`/article/${encodeURIComponent('사용자:' + comment.hiderName)}`") 사용자:{{comment.hiderName}}
      | 에 의해 숨겨졌습니다.
</template>

<script>
import { mapState } from 'vuex'
import WikiHtml from '~/components/WikiHtml'
import request from '~/utils/request'

export default {
  components: {
    WikiHtml
  },
  props: {
    comment: Object
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async hide () {
      await request({
        method: 'put',
        path: `discussion-comments/${this.comment.id}/status`,
        body: {
          status: 'HIDDEN'
        }
      })
      history.go(0)
    },
    async unhide () {
      await request({
        method: 'put',
        path: `discussion-comments/${this.comment.id}/status`,
        body: {
          status: 'PUBLIC'
        }
      })
      history.go(0)
    }
  }
}
</script>

<style lang="scss">
@import '~assets/style-variables.scss';

.discussion-comment-card {
  .card-header {
    background-color: $background;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
  }
  .comment-info {
    flex: 1;
    display: flex;    
    justify-content: space-between;    
  }
  .comment-admin {
    margin-left: 1rem;
  }
  .card-content {
    padding: 1rem;
  }
  .hidden-comment {
    background-color: $light;
  }
}
</style>
