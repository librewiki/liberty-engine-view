<template lang="pug">
.page.page-redirections
  b-table(:data="redirections")
    template(slot-scope="props")
      b-table-column(label="이름") {{ props.row.sourceFullTitle }}
      b-table-column(label="삭제")
        button.button.is-danger(@click="deleteRedirection(props.row.sourceFullTitle)") 삭제
    template(slot="empty") 이 문서로 가는 넘겨주기가 존재하지 않습니다.
  hr
  h3.is-size-3 새 넘겨주기 만들기
  b-field(label="넘겨줄 이름")
    b-input(v-model="model.redirectionName")
  .right-wrapper
    button.button.is-primary(@click="addRedirection") 저장
</template>

<script>
import articleManager from '~/utils/articleManager'
import WikiHtml from '~/components/WikiHtml'

export default {
  components: {
    WikiHtml
  },
  data () {
    return {
      model: {
        redirectionName: ''
      }
    }
  },
  async asyncData ({ params, req, res, error, store }) {
    store.commit('meta/clear')
    const fullTitle = params.fullTitle
    store.commit('meta/update', {
      title: `"${fullTitle}" 문서로 넘겨주기`
    })
    try {
      const article = await articleManager.getByFullTitle(fullTitle, {
        fields: [
          'id',
          'fullTitle',
          'redirections',
          'allowedActions',
          'numOpenDiscussions'
        ],
        req,
        res
      })
      store.commit('meta/update', {
        title: `"${article.fullTitle}" 문서로 넘겨주기`,
        toolBox: {
          allowedActions: article.allowedActions,
          fullTitle: article.fullTitle,
          numOpenDiscussions: article.numOpenDiscussions
        }
      })
      return {
        article,
        redirections: article.redirections
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
  methods: {
    async addRedirection () {
      try {
        await articleManager.addRedirection({
          destinationFullTitle: this.article.fullTitle,
          sourceFullTitle: this.model.redirectionName
        })
        history.go(0)
      } catch (err) {
        if (err.response.data.name === 'ConflictError') {
          this.$toast.open({
            duration: 3000,
            message: '해당 이름을 가진 문서나 넘겨주기가 이미 존재합니다.',
            type: 'is-danger'
          })
        } else {
          throw err
        }
      }
    },
    async deleteRedirection (sourceFullTitle) {
      await articleManager.deleteRedirection({
        destinationFullTitle: this.article.fullTitle,
        sourceFullTitle
      })
      history.go(0)
    }
  }
}
</script>
