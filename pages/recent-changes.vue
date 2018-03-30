<template lang="pug">
.page.page-recent-changes
  ul.recent-changes-list
    li.recent-change-row(v-for="revision in recentChanges" :key="revision.id")
      nuxt-link.full-title(:to="`/article/${encodeURIComponent(revision.articleFullTitle)}`")
        | {{ revision.articleFullTitle }}
      span.changed-at
        time(:datetime="$moment(revision.createdAt).format()")
          | {{ $moment(revision.createdAt).format('LLLL') }}
      span.author-name {{ revision.authorName || revision.ipAddress }}
      span.changed-length-pos(v-if="revision.changedLength > 0")
        | ({{`+ ${revision.changedLength}` }})
      span.changed-length-neg(v-else-if="revision.changedLength < 0")
        | ({{ revision.changedLength }})
      span.changed-length-zero(v-else) (0)
      span.summary(v-if="revision.summary") ({{ revision.summary }})
</template>

<script>
import request from '~/utils/request'

export default {
  async asyncData ({ params, req, res, error, store }) {
    store.commit('meta/clear')
    store.commit('meta/update', {
      title: '최근 바뀜'
    })
    const resp = await request({
      method: 'get',
      path: 'revisions?limit=50',
      req,
      res
    })
    const recentChanges = resp.data.revisions
    return { recentChanges }
  }
}
</script>

<style lang="scss">
@import '~assets/style-variables.scss';

.page-recent-changes {
  .recent-changes-list {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  .recent-change-row {
    border-bottom: 1px solid $border;
    padding: 0.5rem 0;
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
}
</style>
