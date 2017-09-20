<template lang="pug">
nav.liberty-navbar.navbar
  .container
    .navbar-brand
      nuxt-link(to="/")
        | {{ settings.data.wikiName }}
    .navbar-menu
      .navbar-start
        nuxt-link.navbar-item(to="/recent-changes")
          b-icon(icon="refresh")
          | 최근바뀜
        nuxt-link.navbar-item(to="/random")
          b-icon(icon="random")
          | 랜덤문서
        //- b-dropdown
        //-   a.navbar-item(slot="trigger")
        //-     b-icon(icon="comments")
        //-     | 게시판
        //-     b-icon(icon="caret-down")
        //-   b-dropdown-item(has-link)
        //-     a(href="#") 위키방
        //- b-dropdown
        //-   a.navbar-item(slot="trigger")
        //-     b-icon(icon="gear")
        //-     | 도구
        //-     b-icon(icon="caret-down")
        //-   b-dropdown-item(has-link)
        //-     a(href="#") 관리자 도구
        //- b-dropdown
        //-   a.navbar-item(slot="trigger")
        //-     b-icon(icon="book")
        //-     | 도움말
        //-     b-icon(icon="caret-down")
        //-   b-dropdown-item(has-link)
        //-     a(href="#") 문법 도움말
      .navbar-end
        .search-box-wrapper
          b-field
            b-input(placeholder="검색" type="search" icon="search" v-model="searchInput" @keyup.enter.native="go")
            p.control
              button.button(active-class="" @click="go")
                b-icon(icon="arrow-right")
            p.control
              button.button(active-class="" @click="search")
                b-icon(icon="search")
        nuxt-link.navbar-item(v-if="!user.isLoggedIn" to="/login")
          b-icon(icon="sign-in")
        a.navbar-item(v-else role="button" @click="logout")
          b-icon(icon="sign-out")
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      searchInput: ''
    }
  },
  computed: {
    ...mapState(['settings', 'user'])
  },
  methods: {
    go () {
      if (this.searchInput) {
        this.$router.push(`/go/${encodeURIComponent(this.searchInput)}`)
      }
    },
    search () {
      if (this.searchInput) {
        this.$router.push(`/search/${encodeURIComponent(this.searchInput)}`)
      }
    },
    logout () {
      this.$store.dispatch('user/logout')
    }
  }
}
</script>

<style lang="scss">
.liberty-navbar {
  top: 0;
  z-index: 18;
  position: fixed;
  width: 100%;
  .dropdown + .dropdown {
    margin: 0;
  }
  .navbar-start .navbar-item {
    padding: 0.5rem 0.7rem;
    .icon {
      &:first-child {
        margin-right: 0.5rem;
      }
      .fa {
        font-size: 1rem;
      }
    }
  }
  .navbar-brand {
    display: flex;
    align-items: center;
    margin-right: 1rem;
    a {
      color: white;
    }
  }
  .navbar-end {
    align-items: center;
  }
  .search-box-wrapper {
    margin-right: 1rem;
  }
}
</style>
