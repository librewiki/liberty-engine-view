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
      nuxt-link(to="/admin/email") 이메일 설정
    li
      nuxt-link(to="/admin/ip-block") 아이피 차단
    li
      nuxt-link(to="/admin/ip-unblock") 아이피 차단 해제
    li
      nuxt-link(to="/admin/user-block") 사용자 차단
    li
      nuxt-link(to="/admin/user-unblock") 사용자 차단 해제
    li
      nuxt-link(to="/admin/role") 역할 관리
    li
      nuxt-link(to="/admin/grant") 사용자 역할 부여 / 해제
  p.menu-label 확장기능 관리
  ul.menu-list
    li(v-for="extensionName in extensions")
      nuxt-link(:to="`/admin/extension/${encodeURIComponent(extensionName)}`") {{ extensionName }}
</template>

<script>
export default {
  props: {
    extensions: Array
  }
}
</script>

<style lang="css">
</style>
