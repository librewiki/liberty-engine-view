<template lang="pug">
.admin-general
  | 
</template>

<script>
import AdminMenu from '~/components/AdminMenu'

export default {
  components: {
    AdminMenu
  },
  async asyncData ({ params, req, res, error, store, redirect }) {
    store.commit('meta/clear')
    store.commit('meta/update', {
      title: '관리자 페이지 - 통계'
    })
  }
}
</script>

<style lang="css">
</style>
