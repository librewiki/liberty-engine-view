<template lang="pug">
#app.app
  navbar
  .main-container.container
    article.box.is-paddingless
      header.main-header
        .level
          .level-left
            .level-item
              h1.title {{ meta.title }}
          .level-right
            .level-item
              tool-box(v-if="meta.toolBox")
      section.main-content
        nuxt
      liberty-footer.footer.main-footer
</template>

<script>
import { mapState } from 'vuex'
import Navbar from '~/components/Navbar'
import ToolBox from '~/components/ToolBox'
import LibertyFooter from '~/components/LibertyFooter'

export default {
  components: {
    Navbar,
    ToolBox,
    LibertyFooter
  },
  computed: {
    ...mapState(['meta', 'settings'])
  },
  head () {
    return {
      title: this.meta.title || '',
      titleTemplate: `%s - ${this.settings.data.wikiName}`
    }
  }
}
</script>

<style lang="scss">
@import '~assets/style-variables.scss';
@import "~bulma";
@import "~buefy/src/scss/buefy";

* {
  outline: none;
}

html {
  background-color: #f5f5f5;
}

.right-wrapper {
  display: flex;
  justify-content: flex-end;
}

.app {
  .main-container {
    margin-top: ($navbar-height + 1rem);
    margin-bottom: 1rem;
  }
  .liberty-navbar {
    position: fixed;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12);
  }
  .main-header {
    padding: $box-padding;
    border-top-left-radius: $radius-large;
    border-top-right-radius: $radius-large;
    background-color: $background;
  }
  .main-content {
    padding: $box-padding;
  }
  .main-footer {
    padding: $box-padding;
    border-bottom-left-radius: $radius-large;
    border-bottom-right-radius: $radius-large;
    background-color: $background;
  }
}
</style>
