<template lang="pug">
.page.page-article
  wiki-html(v-if="exists" :html="article.html")
</template>

<script>
import articleManager from '~/utils/articleManager'
import WikiHtml from '~/components/WikiHtml'

export default {
  components: {
    WikiHtml
  },
  async asyncData ({ params, req, res, error, store, route }) {
    store.commit('meta/clear')
    const fullTitle = params.fullTitle
    store.commit('meta/update', {
      title: fullTitle
    })
    try {
      const article = await articleManager.getByFullTitle(fullTitle, {
        fields: [
          'id',
          'fullTitle',
          'namespaceId',
          'title',
          'updatedAt',
          'html',
          'wikitext',
          'latestRevisionId',
          'allowedActions'
        ],
        req,
        res
      })
      store.commit('meta/update', {
        title: article.fullTitle,
        updatedAt: article.updatedAt,
        toolBox: {
          fullTitle: article.fullTitle,
          allowedActions: article.allowedActions
        }
      })
      return {
        exists: true,
        article
      }
    } catch (err) {
      if (!err.response) {
        return error({ statusCode: 500 })
      }
      if (err.response.data.name === 'UnauthorizedError') {
        error({ statusCode: 403, message: '이 문서를 읽을 권한이 없습니다.' })
      } else {
        error({ statusCode: 404, message: '문서가 존재하지 않습니다.', createArticleLink: `/edit/${fullTitle}` })
      }
    }
  },
  data () {
    return {
      mediaFile: null
    }
  }
}
</script>
