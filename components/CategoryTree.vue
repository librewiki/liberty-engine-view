<template lang="pug">
.category-tree
  template(v-if="subcategories.length")
    h3.is-size-3 하위 분류
    ul.subcategories
      li.subcategory(v-for="subcategory in subcategories")
        nuxt-link(:to="`/article/${encodeURIComponent('분류:' + subcategory)}`") {{ subcategory }}
    hr
  h3.is-size-3 이 분류에 속하는 문서
  ul.members(v-if="members.length")
    li.member(v-for="member in members")
      nuxt-link(:to="`/article/${encodeURIComponent(member)}`") {{ member }}
  p(v-else)
    | 이 분류에 속하는 문서가 없습니다.
</template>

<script>
export default {
  props: {
    subcategories: Array,
    members: Array
  },
  methods: {
  }
}
</script>

<style lang="scss">
.category-tree {
  li {
    list-style: initial;
  }
  .subcategory {
    margin-left: 1rem;
  }
  .member {
    margin-left: 1rem;
  }
}
</style>
