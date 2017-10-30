<template lang="pug">
.page.page-discussion
  .topic
    h3.title.topic-title {{ discussionTopic.title }}
  discussion-comment-card(
    v-for="comment in discussionTopic.comments"
    :key="comment.id"
    :comment="comment"
  )
  hr
  .add-topic-form
    h3.title 새 댓글
    b-field
      b-input(
        type="textarea"
        placeholder="위키텍스트 입력이 가능합니다."
        v-model="model.wikitext"
      )
    .right-wrapper
      button.button.is-primary(@click="submit") 작성
</template>

<script>
import request from '~/utils/request'
import DiscussionCommentCard from '~/components/DiscussionCommentCard'

export default {
  components: {
    DiscussionCommentCard
  },
  data () {
    return {
      busy: false,
      model: {
        wikitext: ''
      }
    }
  },
  async asyncData ({ params, req, res, store, error }) {
    store.commit('meta/clear')
    try {
      const resp = await request({
        method: 'get',
        path: `discussion-topics/${params.id}`,
        req,
        res
      })
      const discussionTopic = resp.data.discussionTopic
      const fullTitle = discussionTopic.article.fullTitle
      store.commit('meta/update', {
        title: `"${fullTitle}" - ${discussionTopic.title}`
      })
      return { discussionTopic }
    } catch (err) {
      if (!err.response) {
        return error({ statusCode: 500 })
      }
      if (err.response.status === 404) {
        return error({ statusCode: 404, message: '문서가 존재하지 않습니다.' })
      }
      if (err.response.data.name === 'UnauthorizedError') {
        return error({ statusCode: 403, message: '권한이 없습니다.' })
      }
      return error({ statusCode: 500 })
    }
  },
  methods: {
    async submit () {
      if (this.busy || !this.model.wikitext) {
        return
      }
      this.busy = true
      await request({
        method: 'post',
        path: `discussion-topics/${this.discussionTopic.id}/comments`,
        body: {
          wikitext: this.model.wikitext
        }
      })
      this.model.wikitext = ''
      this.busy = false
      history.go(0)
    }
  }
}
</script>

<style lang="scss">
.page-discussion {
  .topic-title {
    margin-bottom: 1rem;
  }
  .discussion-comment-card {
    margin-bottom: 1rem;
  }
}
</style>
