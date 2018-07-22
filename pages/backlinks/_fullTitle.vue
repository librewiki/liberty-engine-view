<template lang="pug">
.page.page-backlinks
  ul(v-if="articleLinks.length + fileLinks.length")
    li(v-for="backlink in articleLinks")
      nuxt-link(:to="`/article/${encodeURIComponent(backlink.sourceArticle.fullTitle)}`") {{ backlink.sourceArticle.fullTitle }}
      | (
      nuxt-link(:to="`/backlinks/${encodeURIComponent(backlink.sourceArticle.fullTitle)}`") ← 가리키는 문서 목록
      | |
      nuxt-link(:to="`/edit/${encodeURIComponent(backlink.sourceArticle.fullTitle)}`") 편집
      | )
    li(v-for="backlink in fileLinks")
      nuxt-link(:to="`/article/${encodeURIComponent(backlink.sourceArticle.fullTitle)}`") {{ backlink.sourceArticle.fullTitle }}
      = " "
      | (연결된 파일) (
      nuxt-link(:to="`/backlinks/${encodeURIComponent(backlink.sourceArticle.fullTitle)}`") ← 가리키는 문서 목록
      | |
      nuxt-link(:to="`/edit/${encodeURIComponent(backlink.sourceArticle.fullTitle)}`") 편집
      | )
  p(v-else)
    nuxt-link(:to="`/article/${encodeURIComponent(article.fullTitle)}`") {{ article.fullTitle }}
    | &nbsp;문서를 가리키는 문서가 없습니다.
</template>

<script>
import articleManager from '~/utils/articleManager'
import WikiHtml from '~/components/WikiHtml'
import request from '~/utils/request'

export default {
  components: {
    WikiHtml
  },
  async asyncData ({ params, req, res, error, store }) {
    store.commit('meta/clear')
    const fullTitle = params.fullTitle
    store.commit('meta/update', {
      title: `"${fullTitle}" 문서를 가리키는 문서`
    })
    try {
      const article = await articleManager.getByFullTitle(fullTitle, {
        fields: [
          'id',
          'fullTitle',
          'allowedActions',
          'numOpenDisucssions'
        ],
        req,
        res
      })
      store.commit('meta/update', {
        title: `"${article.fullTitle}" 문서를 가리키는 문서`,
        toolBox: {
          allowedActions: article.allowedActions,
          fullTitle: article.fullTitle,
          numOpenDisucssions: article.numOpenDisucssions
        }
      })
      const resp = await request({
        method: 'get',
        path: `links`,
        query: {
          to: article.fullTitle
        },
        req,
        res
      })
      const { articleLinks, fileLinks } = resp.data
      return {
        article,
        articleLinks,
        fileLinks
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
  }
}
</script>
