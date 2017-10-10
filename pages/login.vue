<template lang="pug">
.page.page-login(@keyup.enter="submit")
  b-field(label="사용자 이름")
    b-input(placeholder="사용자 이름을 입력하세요" v-model="model.username")
  b-field(label="비밀번호")
    b-input(placeholder="비밀번호를 입력하세요" v-model="model.password" type="password")
  button.button.is-primary(@click="submit") 로그인
  p
    | 계정이 없나요?
    = " "
    nuxt-link(to="/signup") 회원가입
</template>

<script>
import { mapState } from 'vuex'

export default {
  middleware: ['shouldBeAnonymous'],
  asyncData ({ store }) {
    store.commit('meta/clear')
    store.commit('meta/update', {
      title: '로그인'
    })
  },
  data () {
    return {
      model: {
        username: '',
        password: ''
      }
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async submit () {
      try {
        await this.$store.dispatch('user/login', {
          username: this.model.username,
          password: this.model.password
        })
        if (this.user.isLoggedIn) {
          this.$router.push(`/article/${encodeURIComponent('사용자:' + this.user.username)}`)
        }
      } catch (err) {
        this.$toast.open({
          duration: 3000,
          message: '아이디와 비밀번호를 확인해 주세요.',
          type: 'is-danger'
        })
      }
    }
  }
}
</script>

<style lang="css">
</style>
