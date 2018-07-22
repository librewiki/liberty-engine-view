<template lang="pug">
.admin-extension
  vue-form-generator.dynamic-form(
    :schema="schema"
    :model="model"
  )
  button.button.is-primary(@click="submit") 저장
</template>

<script>
import request from '~/utils/request'

export default {
  async asyncData ({ params: { extensionName }, req, res, error, store, redirect }) {
    store.commit('meta/clear')
    store.commit('meta/update', {
      title: `관리자 페이지 - 확장기능: ${extensionName}`
    })
    const { data: { formSchema, currentData } } = await request({
      method: 'get',
      path: `extensions/${encodeURIComponent(extensionName)}/form`,
      req,
      res
    })

    return {
      extensionName,
      schema: formSchema,
      model: currentData
    }
  },
  methods: {
    async submit () {
      try {
        await request({
          path: `extensions/${encodeURIComponent(this.extensionName)}/configuration`,
          method: 'put',
          body: this.model
        })
        history.go(0)
      } catch (err) {
        this.$toast.open({
          duration: 3000,
          message: '오류가 발생했습니다.',
          type: 'is-danger'
        })
      }
    }
  }
}
</script>

<style lang="scss">
.admin-extension {
  .dynamic-form {
    fieldset {
      border: 0;
    }
  }
}
</style>
