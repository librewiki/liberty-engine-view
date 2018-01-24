<template lang="pug">
.page.page-user-settings
  section
    h3.is-size-3 비밀번호 변경
      b-field(label="현재 비밀번호")
        b-input(placeholder="현재 비밀번호를 입력하세요." v-model="model.oldPassword" type="password")
      b-field(label="새 비밀번호")
        b-input(placeholder="변경할 비밀번호를 입력하세요." v-model="model.newPassword" type="password")
      b-field(label="새 비밀번호 확인")
        b-input(placeholder="변경할 비밀번호를 다시 한번 입력하세요." v-model="model.newPasswordRetype" type="password")
      button.button.is-primary(@click="submitChangePassword") 비밀번호 변경
</template>

<script>
import { mapState } from 'vuex'
import request from '~/utils/request'

export default {
  async asyncData ({ params, req, res, error, store }) {
    store.commit('meta/clear')
    store.commit('meta/update', {
      title: '사용자 설정'
    })
    if (!store.state.user.isLoggedIn) {
      return error({ message: '해당 페이지를 보기 위해서는 로그인해야 합니다.' })
    }
  },
  computed: {
    ...mapState(['user'])
  },
  data () {
    return {
      model: {
        oldPassword: '',
        newPassword: '',
        newPasswordRetype: ''
      }
    }
  },
  methods: {
    async submitChangePassword () {
      if (!this.model.oldPassword || !this.model.newPassword || !this.model.newPasswordRetype) {
        this.$toast.open({
          duration: 3000,
          message: '항목을 모두 입력해 주세요.',
          type: 'is-warning'
        })
        return
      }
      if (this.model.newPassword.length < 6) {
        this.$toast.open({
          duration: 3000,
          message: '비밀번호는 6자 이상 입력해야 합니다.',
          type: 'is-warning'
        })
        return
      }
      if (this.model.newPassword !== this.model.newPasswordRetype) {
        this.$toast.open({
          duration: 3000,
          message: '비밀번호를 확인해 주세요.',
          type: 'is-warning'
        })
        return
      }
      try {
        await request({
          method: 'put',
          path: `users/${this.user.id}/password`,
          body: {
            password: this.model.newPassword,
            oldPassword: this.model.oldPassword
          }
        })
      } catch (err) {
        this.$toast.open({
          duration: 3000,
          message: '비밀번호 변경에 실패했습니다.',
          type: 'is-danger'
        })
        return
      }
      this.$toast.open({
        duration: 3000,
        message: '비밀번호를 성공적으로 변경했습니다.',
        type: 'is-success'
      })
    }
  }
}
</script>

<style lang="css">
</style>
