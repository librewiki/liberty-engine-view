<template lang="pug">
footer.liberty-footer
  .updated-at(v-if="meta.updatedAt")
    | 이 문서는&nbsp;
    time(:datetime="$moment(meta.updatedAt).format()")
      | {{ $moment(meta.updatedAt).format('LLLL') }}
    | 에 마지막으로 바뀌었습니다.
  .license-notice(v-if="meta.updatedAt && settings.data.license !== 'OTHERS'")
    | 모든 텍스트는&nbsp;
    a.external(:href="settings.data.license.url" target="_blank") {{settings.data.license.name}}
    | 에 따라 사용할 수 있습니다.
  ul.footer-links
    li.footer-link
      nuxt-link(:to="`/article/${encodeURIComponent('개인정보 정책')}`") 개인정보 정책
    li.footer-link
      nuxt-link(:to="`/article/${encodeURIComponent('위키 소개')}`") 위키 소개
    li.footer-link
      nuxt-link(:to="`/article/${encodeURIComponent('면책 조항')}`") 면책 조항
    li.footer-link
      nuxt-link(:to="`/article/${encodeURIComponent('이용 약관')}`") 이용 약관
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['meta', 'settings'])
  }
}
</script>

<style lang="scss">
.liberty-footer {
  .footer-link {
    display: inline-block;
    margin-right: 1em;
  }
}
</style>
