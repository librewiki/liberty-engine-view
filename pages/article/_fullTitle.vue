<template lang="pug">
.page.page-article
  template(v-if="exists")
    img(v-if="mediaFile" :src="`/media/${encodeURIComponent(mediaFile.filename)}`")
    wiki-html(:html="article.html")
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
      let mediaFile = null
      if (article.namespaceId === 6) {
        const resp = await request({
          method: 'get',
          path: `media-files/${article.id}`,
          req,
          res
        })
        mediaFile = resp.data.mediaFile
      }
      return {
        exists: true,
        article,
        mediaFile
      }
    } catch (err) {
      if (!err.response) {
        return error({ statusCode: 500 })
      }
      if (err.response.status === 404) {
        return error({ statusCode: 404, message: '문서가 존재하지 않습니다.', createArticleLink: `/edit/${fullTitle}` })
      }
      if (err.response.data.name === 'UnauthorizedError') {
        return error({ statusCode: 403, message: '이 문서를 읽을 권한이 없습니다.' })
      }
      return error({ statusCode: 500 })
    }
  },
  data () {
    return {
      mediaFile: null
    }
  }
}
</script>
