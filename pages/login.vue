<template lang="html">
  <div @keyup.enter="submit">
    <b-field>
      <b-input placeholder="사용자 이름을 입력하세요" v-model="model.username"></b-input>
    </b-field>
    <b-field>
      <b-input placeholder="비밀번호를 입력하세요" v-model="model.password" type="password"></b-input>
    </b-field>
    <button class="button" @click="submit">
      로그인
    </button>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
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
