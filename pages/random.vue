<template>
</template>

<script>
import request from '~/utils/request'

export default {
  async asyncData ({ redirect }) {
    const resp = await request({
      method: 'get',
      path: 'articles?random=true&limit=1'
    })
    if (resp.data.articles.length) {
      redirect(`/article/${encodeURIComponent(resp.data.articles[0].fullTitle)}`)
    } else {
      redirect('/')
    }
  }
}
</script>
