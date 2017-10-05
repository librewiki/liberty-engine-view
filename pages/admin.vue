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
  asyncData ({ redirect }) {
    return redirect('/admin/statistics')
  }
}
</script>

<style lang="css">
</style>
