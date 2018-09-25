<template lang="pug">
.tool-box
  .tabs.is-toggle
    ul(v-if="allowedActions.includes('read')")
      nuxt-link(
        tag="li"
        :to="`/article/${encodedFullTitle}`"
      )
        a 읽기
      nuxt-link(
        v-if="allowedActions.includes('edit')"
        tag="li"
        :to="`/edit/${encodedFullTitle}`"
      )
        a 편집
      nuxt-link(
        v-else
        tag="li"
        :to="`/edit/${encodedFullTitle}`"
      )
        a 원본 보기
      nuxt-link(
        v-if="allowedActions.includes('read-discussion')"
        tag="li"
        :to="`/topics/${encodedFullTitle}`"
      )
        a 토의&nbsp;
          b-tag(v-if="numOpenDisucssions" rounded type="is-primary") {{ numOpenDisucssions }}
      nuxt-link(
        v-if="allowedActions.includes('read')"
        tag="li"
        :to="`/history/${encodedFullTitle}`"
      )
        a 역사
  b-dropdown(position="is-bottom-left")
    .button.dropdown-button(slot="trigger")
      b-icon(icon="caret-down")
    b-dropdown-item(:has-link="true")
      nuxt-link(:to="`/backlinks/${encodedFullTitle}`") 역링크
    b-dropdown-item(:has-link="true")
      nuxt-link(:to="`/redirections/${encodedFullTitle}`") 넘겨주기
    b-dropdown-item(:has-link="true")
      nuxt-link(v-if="allowedActions.includes('rename')" :to="`/rename/${encodedFullTitle}`") 문서명 변경
    b-dropdown-item(v-if="allowedActions.includes('set-permission')" :has-link="true")
      nuxt-link(:to="`/permission/${encodedFullTitle}`") 문서 권한 설정
    b-dropdown-item(v-if="allowedActions.includes('delete')" :has-link="true")
      nuxt-link.has-text-danger(:to="`/delete/${encodedFullTitle}`") 삭제
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
      },
      numOpenDisucssions: state => {
        if (!state.meta.toolBox) {
          return 0
        }
        return state.meta.toolBox.numOpenDiscussions
      }
    })
  }
}
</script>

<style lang="scss">
@import '~assets/style-variables.scss';

.tool-box {
  background: white;
  display: flex;
  .tabs {
    margin-bottom: 0 !important;
    a {
      padding: 0.4rem 0.8rem;
    }
  }
  .tabs.is-toggle li:last-child a {
    border-radius: 0;
  }
  .dropdown {
    margin-left: -1px;
    display: flex;
    .dropdown-trigger {
      display: flex;
      align-items: stretch;
      .dropdown-button {
        border-radius: 0 $radius $radius 0;
        height: auto;
      }
    }
  }
}
</style>
