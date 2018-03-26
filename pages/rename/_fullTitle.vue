<template lang="pug">
.page.page-rename
  b-field(label="새 문서명 (이름공간 포함)")
    b-input(v-model.trim="model.newFullTitle")
  p(v-if="pending") ...
  p(v-else-if="newFullTitleIsAllowed") "{{ model.newFullTitle }}"로 변경 가능합니다.
  p(v-else) "{{ model.newFullTitle }}" 문서가 이미 존재하거나 사용할 수 없습니다.
  b-field(label="변경 사유")
    b-input(v-model.trim="model.summary")
  .right-wrapper
    button.button.is-primary(@click="submit") 문서명 변경
</template>

<script>
import _ from 'lodash'
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
      title: `"${fullTitle}" 문서명 변경`
    })
    try {
      const article = await articleManager.getByFullTitle(fullTitle, {
        fields: [
          'id',
          'fullTitle',
          'allowedActions',
          'numOpenDiscussions'
        ],
        req,
        res
      })
      store.commit('meta/update', {
        title: `"${article.fullTitle}" 문서명 변경`,
        toolBox: {
          allowedActions: article.allowedActions,
          fullTitle: article.fullTitle,
          numOpenDiscussions: article.numOpenDiscussions
        }
      })
      if (!article.allowedActions.includes('rename')) {
        return error({ statusCode: 403, message: '이 문서의 문서명을 변경할 권한이 없습니다.' })
      }
      return {
        article,
        model: {
          newFullTitle: article.fullTitle,
          summary: ''
        }
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
      pending: false,
      newFullTitleIsAllowed: false
    }
  },
  methods: {
    checkExistence: _.debounce(async function (newFullTitle) {
      try {
        await articleManager.getByFullTitle(newFullTitle)
        this.newFullTitleIsAllowed = false
        this.pending = false
      } catch (err) {
        if (err.response.status === 404) {
          this.newFullTitleIsAllowed = true
          this.pending = false
        } else {
          this.newFullTitleIsAllowed = false
          this.pending = false
        }
      }
    }, 200),
    async submit () {
      if (this.pending) return
      if (!this.newFullTitleIsAllowed) {
        this.$toast.open({
          duration: 3000,
          message: '해당 이름을 가진 문서가 이미 존재하거나 사용할 수 없습니다.',
          type: 'is-danger'
        })
      }
      await articleManager.rename({
        fullTitle: this.article.fullTitle,
        newFullTitle: this.model.newFullTitle,
        summary: this.model.summary
      })
      this.$router.push(`/article/${encodeURIComponent(this.model.newFullTitle)}`)
      this.$toast.open({
        duration: 3000,
        message: '문서명을 변경했습니다.',
        type: 'is-success'
      })
      this.$eventHub.$emit('reload-live-recent')
    }
  },
  watch: {
    'model.newFullTitle': function (newFullTitle) {
      this.pending = true
      this.checkExistence(newFullTitle)
    }
  }
}
</script>

<style lang="scss">
</style>
