<template>
</template>

<script>
import request from '~/utils/request'

export default {
  async asyncData ({ redirect, req, res }) {
    const resp = await request({
      method: 'get',
      path: 'articles',
      query: {
        random: true,
        limit: 1
      },
      req,
      res
    })
    if (resp.data.articles.length) {
      redirect(`/article/${encodeURIComponent(resp.data.articles[0].fullTitle)}`)
    } else {
      redirect('/')
    }
  }
}
</script>
