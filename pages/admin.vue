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
  components: {
    AdminMenu
  },
  async asyncData ({ redirect }) {
    redirect('/admin/statistics')
  }
}
</script>

<style lang="css">
</style>
