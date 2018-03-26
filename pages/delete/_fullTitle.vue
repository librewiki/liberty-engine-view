<template lang="pug">
.page.page-delete
  p 문서를 삭제하면 특별한 권한이 있는 사용자만 이 문서와 문서의 역사를 열람할 수 있게 됩니다.
  p 문서 삭제 기록은 공개되므로, 이 위키의 정책에 맞도록 신중하게 진행해 주세요.
  b-field(label="삭제 사유")
    b-input(v-model="model.summary")
  button.button.is-danger(@click="submit") 삭제
</template>

<script>
import articleManager from '~/utils/articleManager'
import WikiHtml from '~/components/WikiHtml'

export default {
  components: {
    WikiHtml
  },
  async asyncData ({ params, query, req, res, error, store }) {
    store.commit('meta/clear')
    const fullTitle = params.fullTitle
    store.commit('meta/update', {
      title: `"${fullTitle}" 문서 삭제`
    })
    try {
      const article = await articleManager.getByFullTitle(fullTitle, {
        fields: [
          'fullTitle',
          'allowedActions',
          'numOpenDiscussions'
        ],
        req,
        res
      })
      store.commit('meta/update', {
        title: `"${article.fullTitle}" 문서 삭제`,
        toolBox: {
          allowedActions: article.allowedActions,
          fullTitle: article.fullTitle,
          numOpenDiscussions: article.numOpenDiscussions
        }
      })
      if (!article.allowedActions.includes('delete')) {
        return error({ statusCode: 403, message: '이 문서를 삭제할 권한이 없습니다.' })
      }
      return {
        article
      }
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
  data () {
    return {
      model: {
        summary: ''
      }
    }
  },
  computed: {
  },
  methods: {
    async submit () {
      await articleManager.delete({ fullTitle: this.article.fullTitle, summary: this.model.summary })
      this.$router.push(`/`)
      this.$eventHub.$emit('reload-live-recent')
    }
  }
}
</script>

<style lang="scss">
.page-history {
  .history-list {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  .history-row {
    margin-bottom: 0.5rem;
  }
  .invisible {
    visibility: hidden;
  }
  .changed-at {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }
  .author-name {
    margin-right: 0.5rem;
  }
  .changed-length-pos {
    color: green;
  }
  .changed-length-neg {
    color: red;
  }
  .changed-length-zero {
    color: #aaa;
  }
  .summary {
    color: #aaa;
    margin-left: 0.5rem;
  }
  .other-tools {
    margin-left: 0.5rem;
  }
}
</style>
