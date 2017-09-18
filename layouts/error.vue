<template>
  <div class="error-page">
    <div>
      <h1 class="error-code">{{ error.statusCode }}</h1>
      <div class="error-wrapper-message">
        <h2 class="error-message">{{ error.message }}</h2>
        <div v-if="error.createArticleLink"><nuxt-link :to="error.createArticleLink">문서를 작성해</nuxt-link> 보세요.</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['error'],
  layout: 'default',
  head () {
    return {
      title: this.error.message || 'An error occured'
    }
  }
}
</script>

<style>
</style>
