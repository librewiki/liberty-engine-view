<template lang="pug">
.page.page-diff
  .diff-content(v-html="diffHtml")
  .diff-content-mobile(v-html="diffHtmlMobile")
</template>

<script>
import { createPatch } from 'diff'
import articleManager from '~/utils/articleManager'
import { Diff2Html } from 'diff2html'

export default {
  validate ({ params, query, store }) {
    return Number(query.old) && Number(query.new)
  },
  async asyncData ({ params, query, req, res, error, store }) {
    store.commit('meta/clear')
    const fullTitle = params.fullTitle
    store.commit('meta/update', {
      title: `"${fullTitle}" 두 판 차이 보기`
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
        title: `"${article.fullTitle}" 두 판 차이 보기`,
        toolBox: {
          allowedActions: article.allowedActions,
          fullTitle: article.fullTitle,
          numOpenDiscussions: article.numOpenDiscussions
        }
      })
      const [oldRevision, newRevision] = await Promise.all([
        articleManager.getRevision({
          id: Number(query.old),
          req,
          res
        }),
        articleManager.getRevision({
          id: Number(query.new),
          req,
          res
        })
      ])
      const patch = createPatch(
        article.fullTitle,
        oldRevision.wikitext,
        newRevision.wikitext,
        `${oldRevision.id}판`,
        `${newRevision.id}판`
      )
      const diffHtml = Diff2Html.getPrettyHtml(patch, { outputFormat: 'side-by-side' })
        .replace('<span class="d2h-tag d2h-changed d2h-changed-tag">CHANGED</span>', '')
        .replace('<span class="d2h-tag d2h-moved d2h-moved-tag">RENAMED</span>', '')
      const diffHtmlMobile = Diff2Html.getPrettyHtml(patch, { outputFormat: 'line-by-line' })

      return {
        oldRevision,
        newRevision,
        diffHtml,
        diffHtmlMobile
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

<style lang="scss">
@import '~assets/style-variables.scss';

.page-diff {
  .diff-content {
    @include touch {
      display: none;
    }
  }
  .diff-content-mobile {
    @include desktop {
      display: none;
    }
  }
}
</style>
