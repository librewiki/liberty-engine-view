<template lang="pug">
.card.discussion-comment-card
  header.card-header
    .comment-author {{ comment.author || comment.ipAddress }}
    .comment-date {{ $moment(comment.createdAt).format('LLLL') }}
  .card-content
    wiki-html(:html="comment.html")
</template>

<script>
import WikiHtml from '~/components/WikiHtml'

export default {
  components: {
    WikiHtml
  },
  props: {
    comment: Object
  }
}
</script>

<style lang="scss">
@import '~assets/style-variables.scss';

.discussion-comment-card {
  .card-header {
    background-color: $background;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
  }
  .card-content {
    padding: 1rem;
  }
}
</style>
