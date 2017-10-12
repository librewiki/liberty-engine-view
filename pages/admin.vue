<template lang="pug">
.page.page-admin
  .columns
    .column.is-one-quarter
      admin-menu
    .column
      nuxt-child
</template>

<script>
import AdminMenu from '~/components/AdminMenu'

export default {
  middleware: ['shouldBeAdmin'],
  components: {
    AdminMenu
  },
  asyncData ({ store }) {
    store.commit('meta/clear')
    store.commit('meta/update', {
      title: '관리자 페이지'
    })
  }
}
</script>

<style lang="css">
</style>
