<template>
</template>

<script>
export default {
  async asyncData ({ redirect, store }) {
    redirect(`/article/${encodeURIComponent(store.state.settings.data.frontPage)}`)
  }
}
</script>
