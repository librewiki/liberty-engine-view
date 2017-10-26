<template lang="pug">
.admin-block
  section
    h3.is-size-3 아이피 차단
    b-field(label="아이피 주소 범위 시작")
      b-input(v-model="model.ipStart")
    b-field(label="아이피 주소 범위 끝")
      b-input(v-model="model.ipEnd")
    b-field(label="차단 사유")
      b-input(v-model="model.reason")
    button.button.is-primary(@click="submit") 차단
</template>

<script>
import request from '~/utils/request'

export default {
  async asyncData ({ params, req, res, error, store, redirect }) {
    store.commit('meta/clear')
    store.commit('meta/update', {
      title: '관리자 페이지 - 통계'
    })
  },
  data () {
    return {
      model: {
        ipStart: '',
        ipEnd: '',
        reason: ''
      }
    }
  },
  methods: {
    async submit () {
      await request({
        path: 'block',
        method: 'post',
        body: {
          ipStart: this.model.ipStart,
          ipEnd: this.model.ipEnd,
          reason: this.model.reason
        }
      })
      history.go(0)
    }
  }
}
</script>