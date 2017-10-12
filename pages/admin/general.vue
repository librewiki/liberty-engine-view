<template lang="pug">
.admin-general
  b-field(label="위키 이름")
    b-input(v-model="model.wikiName")
  b-field(label="첫 페이지")
    b-input(v-model="model.frontPage")
  .right-wrapper
    button.button.is-primary(@click="submit") 저장
</template>

<script>
import request from '~/utils/request'

export default {
  async asyncData ({ params, req, res, error, store, redirect }) {
    store.commit('meta/clear')
    store.commit('meta/update', {
      title: '관리자 페이지 - 일반 설정'
    })
    const resp = await request({
      path: `settings`,
      method: 'get'
    })
    return {
      original: {
        ...resp.data.settings
      },
      model: {
        ...resp.data.settings
      }
    }
  },
  methods: {
    async submit () {
      if (this.original.wikiName !== this.model.wikiName) {
        await request({
          path: `settings/wiki-name`,
          method: 'put',
          body: {
            wikiName: this.model.wikiName
          }
        })
      }
      if (this.original.frontPage !== this.model.frontPage) {
        await request({
          path: `settings/front-page`,
          method: 'put',
          body: {
            frontPage: this.model.frontPage
          }
        })
      }
      history.go(0)
    }
  }
}
</script>

<style lang="css">
</style>
