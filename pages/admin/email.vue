<template lang="pug">
.admin-email
  p 사용자에게 이메일을 보내기 위해 사용할 이메일 계정을 설정합니다.
  b-field(label="host")
    b-input(v-model="model.host")
  b-field(label="port")
    b-input(v-model="model.port")
  b-field(label="secure")
    b-switch(v-model="model.secure") {{ model.secure }}
  b-field(label="user")
    b-input(v-model="model.user")
  b-field(label="password")
    b-input(v-model="model.password")
  .right-wrapper
    button.button.is-primary(@click="submit") 저장
</template>

<script>
import _ from 'lodash'
import request from '~/utils/request'

export default {
  async asyncData ({ params, req, res, error, store, redirect }) {
    store.commit('meta/clear')
    store.commit('meta/update', {
      title: '관리자 페이지 - 이메일 설정'
    })
    const resp = await request({
      path: `settings/email`,
      method: 'get',
      req,
      res
    })
    return {
      original: {
        ...resp.data.email
      },
      model: {
        ...resp.data.email
      }
    }
  },
  methods: {
    async submit () {
      if (!this.model.host || !Number(this.model.port) || !this.model.user || !this.model.password) {
        this.$toast.open({
          duration: 3000,
          message: '모두 입력해 주세요.',
          type: 'is-danger'
        })
        return
      }
      if (!_.isEqual(this.original, this.model) && this.model.host && this.model.password) {
        await request({
          path: `settings/email`,
          method: 'put',
          body: {
            host: this.model.host,
            port: Number(this.model.port),
            secure: this.model.secure || false,
            user: this.model.user,
            password: this.model.password
          }
        })
        history.go(0)
      }
    }
  }
}
</script>
