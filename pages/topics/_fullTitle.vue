<template lang="pug">
.page.page-topics
  template(v-if="article.discussionTopics.length")
    .topic(v-for="topic in article.discussionTopics")
      h3.title.topic-title
        nuxt-link(:to="`/discussion/${topic.id}`") {{ topic.title }}
      discussion-comment-card(:comment="topic.firstComment")
  div(v-else) 진행중인 토의가 없습니다.
  .add-topic-form
    h3.title 새 주제 만들기
    b-field(label="주제")
      b-input(v-model="model.title")
    b-field(label="내용")
      b-input(
        type="textarea"
        placeholder="위키텍스트 입력이 가능합니다."
        v-model="model.wikitext"
      )
    .right-wrapper
      button.button.is-primary(@click="submit") 작성
</template>

<script>
import articleManager from '~/utils/articleManager'
import DiscussionCommentCard from '~/components/DiscussionCommentCard'
import request from '~/utils/request'

export default {
  components: {
    DiscussionCommentCard
  },
  data () {
    return {
      busy: false,
      model: {
        title: '',
        wikitext: ''
      }
    }
  },
  async asyncData ({ params, query, req, res, error, store }) {
    store.commit('meta/clear')
    const fullTitle = params.fullTitle
    store.commit('meta/update', {
      title: `"${fullTitle}" 문서에 관해 진행중인 토의`
    })
    try {
      const article = await articleManager.getByFullTitle(fullTitle, {
        fields: [
          'fullTitle',
          'discussionTopics',
          'allowedActions',
          'numOpenDiscussions'
        ],
        req,
        res
      })
      store.commit('meta/update', {
        title: `"${article.fullTitle}" 문서에 관해 진행중인 토의`,
        toolBox: {
          allowedActions: article.allowedActions,
          fullTitle: article.fullTitle,
          numOpenDiscussions: article.numOpenDiscussions
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
      } else {
        return error({ statusCode: 500 })
      }
    }
  },
  methods: {
    async submit () {
      if (this.busy || !this.model.title || !this.model.wikitext) {
        return
      }
      this.busy = true
      await request({
        method: 'post',
        path: `articles/${encodeURIComponent(this.article.fullTitle)}/discussion-topics`,
        body: {
          title: this.model.title,
          wikitext: this.model.wikitext
        }
      })
      this.model.title = ''
      this.model.wikitext = ''
      this.busy = false
      history.go(0)
    }
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
  .add-topic-form {
    margin-top: 2rem;
  }
}
</style>
