<template lang="pug">
.page.page-signup-success
  p 회원가입에 성공했습니다.
  p 사용자 이름: {{ username }}
  p 이메일: {{ email }}
  p 입력하신 이메일로 인증 코드가 전송되었습니다. 확인하여 주시기 바랍니다.
</template>

<script>
export default {
  asyncData ({ query, store }) {
    store.commit('meta/clear')
    store.commit('meta/update', {
      title: '회원가입 성공'
    })
    return {
      username: query.username,
      email: query.email
    }
  }
}
</script>
