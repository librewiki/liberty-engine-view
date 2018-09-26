<template lang="pug">
.page.page-edit
  b-notification(type="is-danger" v-if="!isEditable" :closable="false")
    | 이 문서에 대한 편집 권한이 없습니다.
  b-notification(type="is-warning" v-if="errorMessage" :closable="false")
    | {{ errorMessage }}
  b-notification(v-if="usingOldRev" :closable="false")
    | 과거 버전을 보고 있습니다. 이대로 편집을 저장하면 이 버전 이후의 편집 내용은 사라집니다.
  b-tabs.editor-switch(type="is-boxed" v-model="modeSwitch")
    b-tab-item(:label="isEditable? '편집' : '원본'")
    b-tab-item(label="미리보기")
    b-tab-item(v-if="isEditable" label="차이 보기")
  nav.navbar.is-transparent.editor-tools(v-if="modeSwitch === 0")
    .navbar-menu
      .navbar-start
        a.navbar-item.editor-tools-item(@click="saveDraft")
          | 임시저장
        b-dropdown
          a.navbar-item.editor-tools-item(slot="trigger" @click="loadDrafts")
            | 불러오기
            b-icon(icon="caret-down")
          b-dropdown-item(has-link v-for="(draft, i) in drafts" key="draft.dateTime")
            a(@click="loadDraft(i)") {{ $moment(draft.dateTime).format('LLLL') }}
  b-field.editor-input(v-if="modeSwitch === 0")
    b-input(
      type="textarea"
      v-model="model.wikitext"
      :readonly="!isEditable"
      rows="15"
    )
  wiki-html(v-else-if="modeSwitch === 1" class="preview-box" :html="previewHtml")
  div(v-else-if="modeSwitch === 2" v-html="diffHtml")
  template(v-if="isEditable")
    b-field(label="편집 요약")
      b-input(v-model.trim="model.summary")
    .right-wrapper
      button.button.is-primary(@click="submit") 저장
</template>

<script>
import articleManager from '~/utils/articleManager'
import WikiHtml from '~/components/WikiHtml'
import request from '~/utils/request'
import { createPatch } from 'diff'
import { Diff2Html } from 'diff2html'

export default {
  components: {
    WikiHtml
  },
  async asyncData ({ params, query, req, res, error, store }) {
    store.commit('meta/clear')
    const fullTitle = params.fullTitle
    store.commit('meta/update', {
      title: `"${fullTitle}" 편집`
    })
    try {
      const article = await articleManager.getByFullTitle(fullTitle, {
        fields: [
          'id',
          'fullTitle',
          'namespaceId',
          'title',
          'wikitext',
          'latestRevisionId',
          'allowedActions',
          'numOpenDiscussions'
        ],
        req,
        res
      })
      const isEditable = article.allowedActions.includes('edit')
      let oldRevision
      if (query.rev) {
        oldRevision = await articleManager.getRevision({
          id: Number(query.rev),
          req,
          res
        })
      }
      store.commit('meta/update', {
        title: isEditable ? `"${article.fullTitle}" 편집` : `"${article.fullTitle}" 원본 보기`,
        toolBox: {
          allowedActions: article.allowedActions,
          fullTitle: article.fullTitle,
          numOpenDiscussions: article.numOpenDiscussions
        }
      })
      return {
        new: false,
        fullTitle: article.fullTitle,
        isEditable,
        article,
        usingOldRev: !!oldRevision,
        originalWikitext: oldRevision ? oldRevision.wikitext : article.wikitext,
        model: {
          wikitext: oldRevision ? oldRevision.wikitext : article.wikitext
        }
      }
    } catch (err) {
      if (!err.response) {
        return error({ statusCode: 500 })
      }
      if (err.response.status === 404) {
        store.commit('meta/update', {
          title: `"${fullTitle}" 문서 만들기`,
          toolBox: null
        })
        return {
          new: true,
          fullTitle,
          isEditable: err.response.data.isCreatable,
          usingOldRev: false,
          originalWikitext: '',
          model: {
            wikitext: ''
          }
        }
      }
      if (err.response.data.name === 'UnauthorizedError') {
        return error({ statusCode: 403, message: '이 문서를 읽을 권한이 없습니다.' })
      }
    }
  },
  data () {
    return {
      modeSwitch: 0,
      drafts: [],
      previewHtml: '',
      errorMessage: null,
      model: {
        wikitext: '',
        summary: ''
      },
      diffHtml: ''
    }
  },
  methods: {
    saveDraft () {
      const drafts = JSON.parse(localStorage.getItem('drafts')) || []
      drafts.unshift({
        wikitext: this.model.wikitext,
        dateTime: new Date()
      })
      drafts.length = drafts.length > 30 ? 30 : drafts.length
      localStorage.setItem('drafts', JSON.stringify(drafts))
    },
    loadDrafts () {
      this.drafts = JSON.parse(localStorage.getItem('drafts')) || []
    },
    loadDraft (i) {
      const drafts = JSON.parse(localStorage.getItem('drafts')) || []
      if (!drafts[i]) return
      this.model.wikitext = drafts[i].wikitext
    },
    async fetchPreview () {
      const resp = await request({ method: 'post', path: 'preview', body: { wikitext: this.model.wikitext } })
      this.previewHtml = resp.data.html
    },
    getDiffHtml () {
      this.diffHtml = Diff2Html.getPrettySideBySideHtmlFromDiff(
        createPatch(
          this.fullTitle,
          this.originalWikitext,
          this.model.wikitext,
          '기존 버전',
          '편집중인 버전'
        )
      )
        .replace('<span class="d2h-tag d2h-changed d2h-changed-tag">CHANGED</span>', '')
        .replace('<span class="d2h-tag d2h-moved d2h-moved-tag">RENAMED</span>', '')
    },
    async submit () {
      if (this.new) {
        await articleManager.create({
          fullTitle: this.fullTitle,
          wikitext: this.model.wikitext,
          summary: this.model.summary
        })
        this.$router.push(`/article/${encodeURIComponent(this.fullTitle)}`)
        this.$eventHub.$emit('reload-live-recent')
      } else {
        try {
          await articleManager.edit({
            fullTitle: this.article.fullTitle,
            latestRevisionId: this.article.latestRevisionId,
            wikitext: this.model.wikitext,
            summary: this.model.summary
          })
          this.$router.push(`/article/${encodeURIComponent(this.fullTitle)}`)
          this.$eventHub.$emit('reload-live-recent')
        } catch (err) {
          if (!err.response) throw err
          if (err.response.data.name === 'NoChangeError') {
            this.errorMessage = '변경 사항이 없습니다.'
            return
          } else if (err.response.data.name === 'EditConflictError') {
            this.errorMessage = '편집 충돌이 있습니다.'
            return
          }
          throw err
        }
      }
    }
  },
  watch: {
    modeSwitch (val) {
      if (val === 1) {
        this.fetchPreview()
      } else if (val === 2) {
        this.getDiffHtml()
      }
    }
  }
}
</script>

<style lang="scss">
@import '~assets/style-variables.scss';

.page-edit {
  .editor-switch {
    margin-bottom: 0;
    .tab-content {
      padding: 0
    }
  }
  .editor-tools {
    background-color: $background;
    border-left: 1px solid $border;
    border-right: 1px solid $border;
    border-bottom: 1px solid $border;
    min-height: 1rem;
    z-index: 2;
  }
  .editor-tools-item {
    padding: 0.4rem 1rem;
    &,
    &:focus,
    &:active,
    &:hover {
      color: #4a4a4a;
    }
  }
  .editor-input {
    textarea {
      border-top: 0;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      box-shadow: initial;
      height: initial;
      &:focus,
      &:active,
      &:hover {
        border-color: $border
      }
    }
  }
  .preview-box {
    border-left: 1px solid $border;
    border-right: 1px solid $border;
    border-bottom: 1px solid $border;
    border-bottom-left-radius: $radius;
    border-bottom-right-radius: $radius;
    padding: 1rem;
    margin-bottom: 0.75rem;
  }
}
</style>
