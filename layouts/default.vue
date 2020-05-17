<template lang="pug">
#app.app
  navbar
  .main-container.container
    .columns.main-columns
      .column.main-column
        block-notice
        site-notice
        article.box.is-paddingless
          header.main-header
            .level.title-wrapper-row
              .level-left
                .level-item
                  h1.title {{ meta.title }}
                  .meta-info(v-if="meta.redirectedFrom || meta.oldRevision")
                    .redirected-from(v-if="meta.redirectedFrom")
                      | (
                      nuxt-link(:to="`/redirections/${encodeURIComponent(meta.title)}`") {{ meta.redirectedFrom }}
                      | 에서 넘어옴)
                    .old-revision(v-if="meta.oldRevision")
                      | {{ $moment(meta.oldRevision.createdAt).format('LLLL') }} 판
              .level-right(v-if="meta.toolBox")
                .level-item
                  tool-box
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
import BlockNotice from '~/components/BlockNotice'
import LiveRecent from '~/components/LiveRecent'

export default {
  components: {
    SiteNotice,
    BlockNotice,
    Navbar,
    ToolBox,
    LibertyFooter,
    LiveRecent
  },
  computed: {
    ...mapState(['meta', 'settings'])
  },
  head () {
    let faviconHref
    if (this.settings.data.favicon && this.settings.data.favicon.filename) {
      if (process.env.NODE_ENV === 'development') {
        faviconHref = `http://localhost:${process.env.API_PORT || '3001'}/media-dev/${this.settings.data.favicon.filename}`
      } else {
        faviconHref = `/media/${this.settings.data.favicon.filename}`
      }
    }
    const link = []
    if (faviconHref) {
      link.push({ rel: 'icon', type: 'image/x-icon', href: faviconHref })
    }
    return {
      title: this.meta.title || '',
      titleTemplate: `%s - ${this.settings.data.wikiName}`,
      link
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

a.new {
  color: $newlink-color;
}

a.external {
  color: #33b733;
  &::before {
    font: normal normal normal 14px/1 FontAwesome;
    text-align: center;
    color: #33b733;
    content: "\f0c1";
  }
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
      margin-top: ($navbar-height * 2 + 0.333rem);
    }
  }
  .main-columns {
    @include touch {
      margin-left: 0;
      margin-right: 0;
    }
  }
  .main-column {
    overflow-y: hidden;
    @include touch {
      padding-top: 0;
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
    border: 1px solid #e1e8ed;
    background-color: $background;
    .title-wrapper-row {
      .level-left > .level-item {
        flex-shrink: 1;
        flex-direction: column;
        align-items: flex-start;
      }
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
    word-wrap: break-word;
    padding: $box-padding;
    border-left: 1px solid #e1e8ed;
    border-right: 1px solid #e1e8ed;
    @include touch {
      padding: ($box-padding / 2);
    }
  }
  .main-footer {
    padding: $box-padding;
    @include touch {
      padding: ($box-padding / 2);
    }
    border: 1px solid #e1e8ed;
    border-bottom-left-radius: $radius-large;
    border-bottom-right-radius: $radius-large;
    background-color: $background;
  }
}
</style>
