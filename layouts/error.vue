<template lang="pug">
layout
  .page.page-error
    h2.error-messgae {{ error.message }}
    p(v-if="error.createArticleLink")
      nuxt-link(:to="error.createArticleLink") 문서를 작성해
      = " "
      | 보세요.
</template>

<script>
import { mapState } from 'vuex'
import Layout from '~/components/Layout'

export default {
  props: ['error'],
  components: {
    Layout
  },
  computed: {
    ...mapState(['meta', 'settings'])
  },
  head () {
    return {
      title: this.error.message || '에러가 발생했습니다.'
    }
  }
}
</script>
