<template lang="pug">
.page.page-login(@keyup.enter="submit")
  b-field(label="사용자 이름")
    b-input(placeholder="사용자 이름을 입력하세요" v-model="model.username")
  b-field(label="비밀번호")
    b-input(placeholder="비밀번호를 입력하세요" v-model="model.password" type="password")
  button.button.is-primary(@click="submit") 로그인
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
      await this.$store.dispatch('user/login', {
        username: this.model.username,
        password: this.model.password
      })
      if (this.user.isLoggedIn) {
        this.$router.push(`/article/${encodeURIComponent('사용자:' + this.user.username)}`)
      }
    }
  }
}
</script>

<style lang="css">
</style>
