<template lang="pug">
.page.page-topics
  .topic(v-for="topic in article.discussionTopics")
    h3.title.topic-title {{ topic.title }}
    discussion-comment-card(:comment="topic.firstComment")
</template>

<script>
import articleManager from '~/utils/articleManager'
import DiscussionCommentCard from '~/components/DiscussionCommentCard'
// import request from '~/utils/request'

export default {
  components: {
    DiscussionCommentCard
  },
  async asyncData ({ params, req, res, error, store, route }) {
    store.commit('meta/clear')
    const fullTitle = params.fullTitle
    store.commit('meta/update', {
      title: `"${fullTitle}" 문서에 관해 진행중인 토의`
    })
    try {
      const article = await articleManager.getByFullTitle(fullTitle, {
        fields: ['fullTitle', 'allowedActions', 'discussionTopics'],
        req,
        res
      })
      store.commit('meta/update', {
        title: `"${article.fullTitle}" 문서에 관해 진행중인 토의`,
        toolBox: {
          allowedActions: article.allowedActions,
          fullTitle: article.fullTitle
        }
      })
      return {
        new: false,
        fullTitle: article.fullTitle,
        article
      }
    } catch (err) {
      if (!err.response) {
        return error({ statusCode: 500 })
      }
      if (err.response.data.name === 'UnauthorizedError') {
        return error({ statusCode: 403, message: '권한이 없습니다.' })
      }
    }
  },
  methods: {
  },
  watch: {
    modeSwitch (val) {
      if (val === 1) {
        this.fetchPreview()
      }
    }
  }
}
</script>

<style lang="scss">
.page-topics {
  .topic {
    margin-bottom: 2rem;
  }
  .topic-title {
    margin-bottom: 0.5rem;
  }
}
</style>
