<template lang="pug">
.page.page-signup(@keyup.enter="submit")
  b-field(label="사용자 이름")
    b-input(placeholder="사용자 이름을 입력하세요" v-model="model.username")
  b-field(label="비밀번호")
    b-input(placeholder="비밀번호를 입력하세요 (6자 이상)" v-model="model.password" type="password")
  b-field(label="비밀번호 확인")
    b-input(placeholder="비밀번호를 다시 입력하세요" v-model="model.passwordRetype" type="password")
  b-field(label="이메일 주소")
    b-input(placeholder="이메일 주소를 입력하세요" v-model="model.email" type="email")
  button.button.is-primary(@click="submit") 회원가입
  p
    | 이미 계정이 있나요?
    = " "
    nuxt-link(to="/login") 로그인
</template>

<script>
import request from '~/utils/request'

export default {
  asyncData ({ store }) {
    store.commit('meta/clear')
    store.commit('meta/update', {
      title: '회원가입'
    })
  },
  data () {
    return {
      model: {
        username: '',
        password: '',
        passwordRetype: '',
        email: ''
      }
    }
  },
  methods: {
    async submit () {
      if (!this.model.username || !this.model.password || !this.model.passwordRetype || !this.model.email) {
        this.$toast.open({
          duration: 3000,
          message: '항목을 모두 입력해 주세요.',
          type: 'is-warning'
        })
        return
      }
      if (this.model.password.length < 6) {
        this.$toast.open({
          duration: 3000,
          message: '비밀번호는 6자 이상 입력해야 합니다.',
          type: 'is-warning'
        })
        return
      }
      if (this.model.password !== this.model.passwordRetype) {
        this.$toast.open({
          duration: 3000,
          message: '비밀번호를 확인해 주세요.',
          type: 'is-warning'
        })
        return
      }
      await request({
        method: 'post',
        path: 'users',
        body: {
          username: this.model.username,
          password: this.model.password,
          email: this.model.email
        }
      })
      this.$router.push(`/signup-success?username=${encodeURIComponent(this.model.username)}&email=${encodeURIComponent(this.model.email)}`)
    }
  }
}
</script>

<style lang="sass">

</style>
