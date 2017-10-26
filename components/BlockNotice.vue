<template lang="pug">
b-notification.block-notice(v-if="isVisible" type="is-danger")
  | 이 아이피는 차단되어 있습니다.
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['user']),
    isVisible () {
      return this.user.isBlockedIp && !['article-fullTitle', 'recent-changes'].includes(this.$route.name)
    }
  }
}
</script>

<style lang="scss">
</style>
