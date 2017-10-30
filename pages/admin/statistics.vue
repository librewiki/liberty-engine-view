<template lang="pug">
.admin-statistics
  | 통계통계
</template>

<script>
export default {
  async asyncData ({ params, req, res, error, store, redirect }) {
    store.commit('meta/clear')
    store.commit('meta/update', {
      title: '관리자 페이지 - 통계'
    })
  }
}
</script>
