<template lang="pug">
aside.menu
  p.menu-label 일반
  ul.menu-list
    li
      nuxt-link(to="/admin/statistics") 통계
  p.menu-label 위키 관리
  ul.menu-list
    li
      nuxt-link(to="/admin/general") 일반 설정
    li
      nuxt-link(to="/admin/block") 차단      
</template>

<script>
export default {
}
</script>

<style lang="css">
</style>
