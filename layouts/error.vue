<template lang="pug">
.page.page-error
  h2.error-messgae {{ error.message }}
  p(v-if="error.createArticleLink")
    nuxt-link(:to="error.createArticleLink") 문서를 작성해
    = " "
    | 보세요.
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['error'],
  computed: {
    ...mapState(['meta', 'settings'])
  },
  head () {
    if (this.error.message === 'This page could not be found') {
      this.$store.commit('meta/clear')
      this.$store.commit('meta/update', {
        title: '페이지가 존재하지 않습니다.'
      })
      this.error.message = '요청하신 페이지가 존재하지 않습니다.'
    }
    return {
      title: this.error.message || '에러가 발생했습니다.',
      titleTemplate: `%s - ${this.settings.data.wikiName}`
    }
  }
}
</script>
