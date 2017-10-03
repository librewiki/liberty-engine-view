<template lang="pug">
.page.page-edit
  b-notification(type="is-danger" v-if="!isEditable" :closable="false")
    | 이 문서에 대한 편집 권한이 없습니다.
  b-notification(type="is-warning" v-if="errorMessage" :closable="false")
    | {{ errorMessage }}
  b-notification(v-if="usingOldRev" :closable="false")
    | 과거 버전을 보고 있습니다. 이대로 편집을 저장하면 이 버전 이후의 편집 내용은 사라집니다.
  b-tabs.editor-switch(type="is-boxed" v-model="modeSwitch")
    b-tab-item(label="편집")
    b-tab-item(label="미리보기")
  b-field.editor-input(v-if="modeSwitch === 0")
    b-input(
      type="textarea"
      v-model="model.wikitext"
      :readonly="!isEditable"
      rows="15"
    )
  wiki-html(v-else class="preview-box" :html="previewHtml")
  .right-wrapper
    button.button.is-primary(@click="submit") 저장
</template>

<script>
import articleManager from '~/utils/articleManager'
import WikiHtml from '~/components/WikiHtml'
import request from '~/utils/request'

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
          'allowedActions'
        ],
        req,
        res
      })
      const isEditable = article.allowedActions.includes('article:edit')
      let oldRevision
      if (query.rev) {
        oldRevision = await articleManager.getRevision({
          id: Number(query.rev)
        })
      }
      store.commit('meta/update', {
        title: isEditable ? `"${article.fullTitle}" 편집` : `"${article.fullTitle}" 원본 보기`,
        toolBox: {
          allowedActions: article.allowedActions,
          fullTitle: article.fullTitle
        }
      })
      return {
        new: false,
        fullTitle: article.fullTitle,
        isEditable,
        article,
        usingOldRev: !!oldRevision,
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
          toolBox: {
            allowedActions: ['article:read', 'article:edit'],
            fullTitle: fullTitle
          }
        })
        return {
          new: true,
          fullTitle,
          isEditable: true, /* @TODO namespace permission check */
          usingOldRev: false,
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
      errorMessage: null
    }
  },
  methods: {
    loadDrafts () {
      this.drafts = JSON.parse(localStorage.getItem('drafts')) || []
    },
    async fetchPreview () {
      const resp = await request({ method: 'post', path: 'preview', body: { wikitext: this.model.wikitext } })
      this.previewHtml = resp.data.html
    },
    async submit () {
      if (this.new) {
        await articleManager.create({
          fullTitle: this.fullTitle,
          wikitext: this.model.wikitext,
          summary: this.model.summary
        })
        this.$router.push(`/article/${this.fullTitle}`)
      } else {
        try {
          await articleManager.edit({
            fullTitle: this.article.fullTitle,
            latestRevisionId: this.article.latestRevisionId,
            wikitext: this.model.wikitext,
            summary: this.model.summary
          })
          this.$router.push(`/article/${this.fullTitle}`)
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
  }
  .editor-input {
    textarea {
      border-top: 0;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      box-shadow: unset;
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
  }
}
</style>
