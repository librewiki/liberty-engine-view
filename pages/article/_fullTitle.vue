<template lang="pug">
.page.page-article
  template(v-if="exists")
    .box.category-box(v-if="article.categories.length")
      | 분류:
      ul.categories
        li.category-item(v-for="cat in article.categories")
          nuxt-link(:to="`/article/${encodeURIComponent('분류:' + cat)}`") {{ cat }}
    img(v-if="mediaFile" :src="mediaFile.devPath || `/media/${mediaFile.filename}`")
    wiki-html(:html="article.html")
    category-tree(v-if="isCategory" :subcategories="subcategories" :members="members")
</template>

<script>
import articleManager from '~/utils/articleManager'
import WikiHtml from '~/components/WikiHtml'
import CategoryTree from '~/components/CategoryTree'
import request from '~/utils/request'

export default {
  components: {
    WikiHtml,
    CategoryTree
  },
  async asyncData ({ params, query, req, res, error, store, redirect }) {
    store.commit('meta/clear')
    const fullTitle = params.fullTitle
    const redirectedFrom = query.redirectedFrom || undefined
    store.commit('meta/update', {
      title: fullTitle,
      redirectedFrom: redirectedFrom
    })
    try {
      const resp = await request({
        method: 'get',
        path: `search/article-case-insensitive-with-redirection/${encodeURIComponent(params.fullTitle)}`,
        req,
        res
      })
      if (resp.data.type === 'REDIRECTION') {
        return redirect(301, `/article/${encodeURIComponent(resp.data.fullTitle)}?redirectedFrom=${encodeURIComponent(params.fullTitle)}`)
      }
      const article = await articleManager.getByFullTitle(fullTitle, {
        revisionId: Number(query.rev) || undefined,
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
          'allowedActions',
          'numOpenDiscussions'
        ],
        req,
        res
      })
      let oldRevision
      if (Number(query.rev)) {
        oldRevision = {
          createdAt: article.updatedAt
        }
      }
      store.commit('meta/update', {
        title: fullTitle,
        oldRevision,
        updatedAt: article.updatedAt,
        toolBox: {
          fullTitle: article.fullTitle,
          allowedActions: article.allowedActions,
          numOpenDiscussions: article.numOpenDiscussions
        }
      })
      let mediaFile = null
      if (article.namespaceId === 6) {
        const resp = await request({
          method: 'get',
          path: `media-files/${encodeURIComponent(article.title)}`,
          req,
          res
        })
        mediaFile = resp.data.mediaFile
        if (process.env.NODE_ENV === 'development') {
          mediaFile.devPath = `http://localhost:${process.env.API_PORT || '3001'}/media-dev/${mediaFile.filename}`
        }
      }
      const isCategory = article.namespaceId === 14
      let members = null
      let subcategories = null
      if (isCategory) {
        const resp = await request({
          method: 'get',
          path: `categories/${encodeURIComponent(article.title)}`,
          req,
          res
        })
        subcategories = resp.data.subcategories
        members = resp.data.members
      }
      return {
        exists: true,
        article,
        mediaFile,
        isCategory,
        subcategories,
        members
      }
    } catch (err) {
      if (!err.response) {
        return error({ statusCode: 500 })
      }
      if (err.response.status === 404) {
        return error({ statusCode: 404, message: '문서가 존재하지 않습니다.', createArticleLink: `/edit/${encodeURIComponent(fullTitle)}` })
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
