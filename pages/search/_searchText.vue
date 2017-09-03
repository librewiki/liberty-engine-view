<template lang="pug">
.page.page-search
  .title-matched(v-if="titleMatched")
    | 이 위키에 "
    nuxt-link(:to="`/wiki/${encodeURIComponent(titleMatched)}`") {{ titleMatched }}
    | " 문서가 존재합니다.
  .search-results
    template(v-if="results.length")
      h3.title 검색 결과
      dl
        template(v-for="result in results")
          dt
            nuxt-link(:to="`/article/${encodeURIComponent(result.fullTitle)}`") {{ result.fullTitle }}
    div(v-else) 검색 결과가 없습니다.
</template>

<script>
import articleManager from '~/utils/articleManager'
import request from '~/utils/request'

export default {
  async asyncData ({ params, req, res, redirect, store, error }) {
    store.commit('meta/clear')
    let titleMatched = null
    store.commit('meta/update', {
      title: `"${params.searchText}" 검색`
    })
    try {
      const article = await articleManager.getByFullTitle(params.searchText, {
        fields: [
          'fullTitle'
        ],
        req,
        res
      })
      titleMatched = article.fullTitle
    } catch (err) {
      if (!err.response || err.response.data.name !== 'ResourceNotFoundError') {
        return error({ statusCode: 500 })
      }
    }
    const resp = await request({
      path: `articles/search?q=${encodeURIComponent(params.searchText)}`,
      req,
      res
    })
    const results = resp.data.articles
    return { titleMatched, results }
  }
}
</script>

<style lang="scss">
.page-search {
  .title-matched {
    margin-bottom: 1rem;
  }
}
</style>
