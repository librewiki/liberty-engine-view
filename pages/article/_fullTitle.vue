<template lang="pug">
.page.page-article
  template(v-if="exists")
    .box.category-box(v-if="article.categories.length")
      | 분류:
      ul.categories
        li.category-item(v-for="cat in article.categories")
          nuxt-link(:to="`/article/${encodeURIComponent('분류:' + cat)}`") {{ cat }}
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
  async asyncData ({ params, query, req, res, error, store }) {
    store.commit('meta/clear')
    const fullTitle = params.fullTitle
    const redirectedFrom = query.redirectedFrom || undefined
    store.commit('meta/update', {
      title: fullTitle,
      redirectedFrom: redirectedFrom
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
          'categories',
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

<style lang="scss">
.page-article {
  .category-box {
    display: flex;
    margin-bottom: 0.5rem;
    padding: 0.5rem 1rem;
  }
  .categories {
    display: flex;
    margin-left: 0.5rem;
  }
  .category-item {
    margin: 0 0.5rem;
  }
}
</style>
