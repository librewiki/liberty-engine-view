<template lang="pug">
.tabs.is-toggle
  ul(v-if="allowedActions.includes('article:read')")
    nuxt-link(
      tag="li"
      :to="`/article/${encodedFullTitle}`"
    )
      a 읽기
  ul(v-if="allowedActions.includes('article:edit')")
    nuxt-link(
      tag="li"
      :to="`/edit/${encodedFullTitle}`"
    )
      a 편집
  ul(v-else)
    nuxt-link(
      tag="li"
      :to="`/edit/${encodedFullTitle}`"
    )
      a 원본 보기
  ul(v-if="allowedActions.includes('discussion:read')")
    nuxt-link(
      tag="li"
      :to="`/topics/${encodedFullTitle}`"
    )
      a 토의
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      allowedActions: state => {
        if (!state.meta.toolBox) {
          return []
        }
        return state.meta.toolBox.allowedActions
      },
      encodedFullTitle: state => {
        if (!state.meta.toolBox) {
          return null
        }
        return encodeURIComponent(state.meta.toolBox.fullTitle)
      }
    })
  }
}
</script>

<style lang="css">
</style>
