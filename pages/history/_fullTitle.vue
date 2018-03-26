<template lang="pug">
.page.page-history
  nuxt-link.button.is-primary(
    v-if="model.fairToCompare.length === 2"
    :to="`/diff/${encodeURIComponent(article.fullTitle)}?old=${oldRev}&new=${newRev}`"
  ) 비교
  button.button.is-static(v-else) 비교
  hr
  ul.history-list
    li.history-row(v-for="revision in article.revisions" :key="revision.id")
      b-checkbox(
        v-model="model.fairToCompare"
        :native-value="revision.id"
        :disabled="model.fairToCompare.length >= 2 && !model.fairToCompare.includes(revision.id)"
      )
      span.changed-at
        time(:datetime="$moment(revision.createdAt).format()")
          nuxt-link(:to="`/article/${encodeURIComponent(article.fullTitle)}?rev=${revision.id}`") {{ $moment(revision.createdAt).format('LLLL') }}
      span.author-name {{ revision.authorName || revision.ipAddress }}
      span.changed-length-pos(v-if="revision.changedLength > 0")
        | ({{`+ ${revision.changedLength}` }})
      span.changed-length-neg(v-else-if="revision.changedLength < 0")
        | ({{ revision.changedLength }})
      span.changed-length-zero(v-else) (0)
      span.summary(v-if="revision.summary") ({{ revision.summary }})
      span.other-tools
        | (
        nuxt-link.show-wikitext(:to="`/edit/${encodeURIComponent(article.fullTitle)}?rev=${revision.id}`") 이 버전 기준으로 편집
        | )
  hr
  nuxt-link.button.is-primary(
    v-if="model.fairToCompare.length === 2"
    :to="`/diff/${encodeURIComponent(article.fullTitle)}?old=${oldRev}&new=${newRev}`"
  ) 비교
  button.button.is-static(v-else) 비교
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
      title: `"${fullTitle}" 편집 역사 보기`
    })
    try {
      const article = await articleManager.getByFullTitle(fullTitle, {
        fields: [
          'fullTitle',
          'revisions',
          'allowedActions',
          'numOpenDiscussions'
        ],
        req,
        res
      })
      store.commit('meta/update', {
        title: `"${article.fullTitle}" 편집 역사 보기`,
        toolBox: {
          allowedActions: article.allowedActions,
          fullTitle: article.fullTitle,
          numOpenDiscussions: article.numOpenDiscussions
        }
      })
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
        fairToCompare: []
      }
    }
  },
  computed: {
    oldRev () {
      if (this.model.fairToCompare.length < 2) {
        return null
      }
      return Math.min(...this.model.fairToCompare)
    },
    newRev () {
      if (this.model.fairToCompare.length < 2) {
        return null
      }
      return Math.max(...this.model.fairToCompare)
    }
  },
  methods: {
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
