<template lang="pug">
#app.app
  navbar
  .main-container.container
    .columns.main-columns
      .column.main-column
        site-notice
        article.box.is-paddingless
          header.main-header
            .level.title-wrapper-row
              .level-left
                .level-item
                  h1.title {{ meta.title }}
              .level-right
                .level-item
                  tool-box(v-if="meta.toolBox")
          section.main-content
            nuxt
          liberty-footer.footer.main-footer
      .column.is-narrow.is-hidden-touch
        live-recent
</template>

<script>
import { mapState } from 'vuex'
import Navbar from '~/components/Navbar'
import ToolBox from '~/components/ToolBox'
import LibertyFooter from '~/components/LibertyFooter'
import SiteNotice from '~/components/SiteNotice'
import LiveRecent from '~/components/LiveRecent'

export default {
  components: {
    SiteNotice,
    Navbar,
    ToolBox,
    LibertyFooter,
    LiveRecent
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
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.right-wrapper {
  display: flex;
  justify-content: flex-end;
}

.app {
  .main-container {
    margin-top: ($navbar-height + 1rem);
    margin-bottom: 1rem;
    @include touch {
      margin-top: ($navbar-height * 2 + 1rem);
    }
  }
  .main-columns {
    @include touch {
      margin-left: 0;
      margin-right: 0;
    }
  }
  .main-column {
    @include touch {
      padding-left: 0;
      padding-right: 0;
    }
  }
  .liberty-navbar {
    position: fixed;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12);
  }
  .main-header {
    padding: $box-padding;
    @include touch {
      padding: ($box-padding / 2);
    }
    border-top-left-radius: $radius-large;
    border-top-right-radius: $radius-large;
    background-color: $background;
    .title-wrapper-row {
      @include mobile {
        display: flex;
        flex-direction: column-reverse;
        align-items: stretch;
        .level-left {
          display: flex;
          align-items: flex-start;
        }
        .level-right {
          margin-top: 0;
          padding-bottom: 0.5rem;
          margin-bottom: 0.5rem;
          display: flex;
          justify-content: flex-end;
          border-bottom: 1px solid #e1e8ed;
        }
      }
    }
  }
  .main-content {
    padding: $box-padding;
    @include touch {
      padding: ($box-padding / 2);
    }
  }
  .main-footer {
    padding: $box-padding;
    @include touch {
      padding: ($box-padding / 2);
    }
    border-bottom-left-radius: $radius-large;
    border-bottom-right-radius: $radius-large;
    background-color: $background;
  }
}

a.new {
  color: $newlink-color;
}
</style>
