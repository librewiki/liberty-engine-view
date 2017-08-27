<template>
</template>

<script>
import request from '~/utils/request'

export default {
  async asyncData ({ params, req, res, redirect, store, error }) {
    try {
      store.commit('meta/update', {
        title: params.fullTitle
      })
      const resp = await request({
        method: 'get',
        path: `articles/full-title-ci/${encodeURIComponent(params.fullTitle)}`,
        req,
        res
      })
      if (resp.data.type === 'REDIRECTION') {
        redirect(`/article/${encodeURIComponent(resp.data.fullTitle)}?redirected-from=${encodeURIComponent(params.fullTitle)}`)
      } else {
        redirect(`/article/${encodeURIComponent(resp.data.fullTitle)}`)
      }
    } catch (err) {
      if (!err.response) {
        return error({ statusCode: 500 })
      }
      if (err.response.data.name === 'ResourceNotFoundError') {
        redirect(`/search/${encodeURIComponent(params.fullTitle)}`)
      } else {
        error()
      }
    }
  }
}
</script>
