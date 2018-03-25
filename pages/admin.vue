<template lang="pug">
.page.page-admin
  .columns
    .column.is-one-quarter
      admin-menu(:extensions="extensions")
    .column
      nuxt-child
</template>

<script>
import AdminMenu from '~/components/AdminMenu'
import request from '~/utils/request'

export default {
  middleware: ['shouldBeAdmin'],
  components: {
    AdminMenu
  },
  async asyncData ({ store, req, res }) {
    store.commit('meta/clear')
    store.commit('meta/update', {
      title: '관리자 페이지'
    })
    const { data: { configurableExtensions } } = await request({
      method: 'get',
      path: `extensions/configurable-extensions`,
      req,
      res
    })
    return {
      extensions: configurableExtensions
    }
  }
}
</script>

<style lang="css">
</style>
