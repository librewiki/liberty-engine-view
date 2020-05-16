<template lang="pug">
.admin-general
  b-field(label="위키 이름")
    b-input(v-model="model.wikiName")
  b-field(label="첫 페이지")
    b-input(v-model="model.frontPage")
  b-field(label="언어")
    b-select(v-model="model.language")
      option(v-for="lang in original.availableLanguages" :value="lang" :key="lang") {{ lang }}
  b-field(label="라이선스")
    b-select(v-model="model.license")
      option(v-for="license in original.availableLicenses" :value="license" :key="license") {{ license }}
  b-field(label="Favicon")
  b-field(grouped)
    b-input(v-model="faviconSearchText" @keyup.native.enter="searchFavicon")
    p.control
      button.button.is-primary(@click="searchFavicon") 찾기
  b-field(message="업로드 도구를 이용해 업로드한 favicon 파일의 제목을 입력해 주세요. (네임스페이스 제외)")
  p
    span {{ model.faviconFilename }}
    b-icon(icon="times" v-if="model.faviconFilename" @click.native="model.faviconFilename = ''")
  b-field(label="공지사항")
    b-input(
      v-model="model.siteNoticeWikitext"
      type="textarea"
    )
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
      method: 'get',
      req,
      res
    })
    return {
      faviconSearchText: '',
      original: {
        ...resp.data.settings
      },
      model: {
        ...resp.data.settings,
        faviconFilename: ''
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
      if (this.original.language !== this.model.language) {
        await request({
          path: `settings/language`,
          method: 'put',
          body: {
            language: this.model.language
          }
        })
      }
      if (this.original.license !== this.model.license) {
        await request({
          path: `settings/license`,
          method: 'put',
          body: {
            license: this.model.license
          }
        })
      }
      if (this.original.siteNoticeWikitext !== this.model.siteNoticeWikitext) {
        await request({
          path: `settings/site-notice`,
          method: 'put',
          body: {
            wikitext: this.model.siteNoticeWikitext
          }
        })
      }
      history.go(0)
    },
    async searchFavicon () {
      if (!this.faviconSearchText) return
      const resp = await request({
        method: 'get',
        path: `media-files/${encodeURIComponent(this.faviconSearchText)}`
      })
      this.model.faviconFilename = resp.data.mediaFile.filename
    }
  }
}
</script>
