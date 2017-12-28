<template lang="pug">
.admin-ip-block
  b-field(label="아이피 주소 범위 시작")
    b-input(v-model="model.ipStart")
  b-field(label="아이피 주소 범위 끝")
    b-input(v-model="model.ipEnd")
  b-field(label="차단 사유")
    b-input(v-model="model.reason")
  b-field(label="차단 기한" message="YYYY-MM-DD HH:mm 형식으로 입력하세요. (예: 2017-03-02 20:49) 비워 둘 경우 무기한 차단됩니다.")
    b-input(v-model="model.exp")
  button.button.is-primary(@click="submit") 차단
</template>

<script>
import request from '~/utils/request'
import { isIP } from 'validator'

export default {
  async asyncData ({ params, req, res, error, store, redirect }) {
    store.commit('meta/clear')
    store.commit('meta/update', {
      title: '관리자 페이지 - 아이피 차단'
    })
  },
  data () {
    return {
      model: {
        ipStart: '',
        ipEnd: '',
        reason: '',
        exp: ''
      }
    }
  },
  methods: {
    async submit () {
      if (!isIP(this.model.ipStart) || !isIP(this.model.ipEnd)) {
        this.$toast.open({
          duration: 3000,
          message: '아이피 주소를 올바르게 입력해 주세요.',
          type: 'is-danger'
        })
        return
      }
      const expiration = this.model.exp ? this.$moment(this.model.exp, 'YYYY-MM-DD HH:mm') : null
      if (expiration && !expiration.isValid()) {
        this.$toast.open({
          duration: 3000,
          message: '날짜를 올바르게 입력해 주세요.',
          type: 'is-danger'
        })
        return
      }
      if (expiration && !expiration.isAfter()) {
        this.$toast.open({
          duration: 3000,
          message: '현재 이후의 시간을 입력해야 합니다.',
          type: 'is-danger'
        })
        return
      }
      await request({
        path: 'blocks',
        method: 'post',
        body: {
          ipStart: this.model.ipStart,
          ipEnd: this.model.ipEnd,
          reason: this.model.reason,
          expiration: expiration || null
        }
      })
      history.go(0)
    }
  }
}
</script>
