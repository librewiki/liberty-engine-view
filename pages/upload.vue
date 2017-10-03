<template lang="pug">
.page.page-upload
  .columns
    .column
      section.file-upload
        h3.is-size-3 파일 선택
        b-field
          b-upload(
            v-model="model.files"
            accept="image/jpeg, image/png, image/gif"
            drag-drop
          )
            section.section
              .content.has-text-centered
                p
                  b-icon(icon="upload" size="is-large").is-size-4
                div 파일을 선택하거나 드래그
                div 최대 크기: 10 MiB
                div 현재 png, jpg, gif 파일만 지원합니다.
    .column(v-if="selectedFile")
      section.file-info
        h3.is-size-3 파일 정보
        img.file-preview(ref="img" v-if="dataUrl" :src="dataUrl")
        .file-orginal-name 원본 이름: {{ selectedFile.name }}
        .file-size {{ (selectedFile.size / 1024).toFixed(2) }} KiB
        .file-width-height {{ width }} × {{ height }}
  hr(v-if="selectedFile")
  section.file-description(v-if="selectedFile")
    h3.is-size-3 파일 설명
    b-field(
      label="파일의 새 이름 (네임스페이스 제외)"
      message="파일을 잘 설명하고 입력하기 쉬운 이름을 지어주세요. 확장자는 입력하지 않아도 됩니다."
    )
      b-input(v-model="model.filename")
    b-field(label="파일 설명 (위키텍스트)")
      b-input(
        type="textarea"
        v-model="model.wikitext"
        rows="10"
      )
    b-field(label="요약")
      b-input(v-model="model.summary")
    .right-wrapper
      button.button.is-primary(@click="submit") 저장
</template>

<script>
import request from '~/utils/request'

export default {
  async asyncData ({ params, req, res, error, store }) {
    store.commit('meta/clear')
    store.commit('meta/update', {
      title: '파일 업로드'
    })
  },
  data () {
    return {
      model: {
        files: [],
        filename: '',
        wikitext: '',
        summary: ''
      },
      dataUrl: null,
      width: null,
      height: null
    }
  },
  computed: {
    selectedFile () {
      return this.model.files[0]
    }
  },
  watch: {
    selectedFile (file) {
      if (!file) {
        return
      }
      if (!file.type.startsWith('image')) {
        return
      }
      const reader = new FileReader()
      reader.onload = async () => {
        this.dataUrl = reader.result
        await this.$nextTick()
        this.width = this.$refs.img.naturalWidth
        this.height = this.$refs.img.naturalHeight
      }
      reader.readAsDataURL(file)
    }
  },
  methods: {
    async submit () {
      if (!this.selectedFile || !this.model.filename) {
        return
      }
      const formData = new FormData()
      formData.append('file', this.selectedFile)
      formData.append('filename', this.model.filename.trim())
      formData.append('wikitext', this.model.wikitext.trim())
      formData.append('summary', this.model.summary.trim())
      await request({
        method: 'post',
        path: 'media-files',
        body: formData
      })
      const descriptionArticleName = `파일:${this.model.filename}`
      this.$router.push(`/article/${encodeURIComponent(descriptionArticleName)}`)
    }
  }
}
</script>

<style lang="css">
</style>
