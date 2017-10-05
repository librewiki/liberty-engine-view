<template lang="pug">
nav.liberty-navbar.navbar
  .container
    .navbar-brand
      nuxt-link(to="/")
        | {{ settings.data.wikiName }}
      .navbar-mobile-buttons
        nuxt-link(to="/recent-changes")
          b-icon(icon="refresh")
        nuxt-link(to="/random")
          b-icon(icon="random")
      .navbar-mobile-right-buttons
    .navbar-menu
      .navbar-start
        nuxt-link.navbar-item(to="/recent-changes")
          b-icon(icon="refresh")
          | 최근바뀜
        nuxt-link.navbar-item(to="/random")
          b-icon(icon="random")
          | 랜덤문서
        b-dropdown
          a.navbar-item(slot="trigger")
            b-icon(icon="comments")
            | 게시판
            b-icon(icon="caret-down")
          b-dropdown-item(has-link)
            a(href="#") 위키방
        b-dropdown
          a.navbar-item(slot="trigger")
            b-icon(icon="gear")
            | 도구
            b-icon(icon="caret-down")
          b-dropdown-item(has-link)
            nuxt-link(to="/admin") 관리자 도구
          b-dropdown-item(has-link)
            nuxt-link(to="/upload") 파일 업로드
        b-dropdown
          a.navbar-item(slot="trigger")
            b-icon(icon="book")
            | 도움말
            b-icon(icon="caret-down")
          b-dropdown-item(has-link)
            a(href="#") 문법 도움말
      .navbar-end
        .search-box-wrapper
          b-field
            b-input.navbar-search-input(placeholder="검색" type="search" icon="search" v-model="searchInput" @keyup.enter.native="go")
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
    .navbar-mobile-search-row
      b-field
        b-input.mobile-search-input(placeholder="검색" type="search" icon="search" v-model="searchInput" @keyup.enter.native="go")
        p.control
          button.button(active-class="" @click="go")
            b-icon(icon="arrow-right")
        p.control
          button.button(active-class="" @click="search")
            b-icon(icon="search")
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
        this.searchInput = ''
      }
    },
    search () {
      if (this.searchInput) {
        this.$router.push(`/search/${encodeURIComponent(this.searchInput)}`)
        this.searchInput = ''
      }
    },
    logout () {
      this.$store.dispatch('user/logout')
    }
  }
}
</script>

<style lang="scss">
@import '~assets/style-variables.scss';

.liberty-navbar {
  top: 0;
  z-index: 18;
  position: fixed;
  width: 100%;
  .mobile-search {
    display: none;
    &.search-mode {
      display: flex;
    }
  }
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
    @include touch {
      margin-left: 0.625rem;
    }
    a {
      color: white;
    }
  }
  .navbar-item {
    white-space: nowrap;
  }
  .navbar-end {
    align-items: center;
  }
  .search-box-wrapper {
    margin-right: 0.3rem;
  }
  .navbar-mobile-buttons {
    margin-left: 0.625rem;
    @include desktop {
      display: none;
    }
  }
  .navbar-mobile-right-buttons {
    margin-left: auto;
    margin-right: 0;
    @include desktop {
      display: none;
    }
  }
  .navbar-mobile-search-row {
    @include desktop {
      display: none;
    }
    margin-top: -0.3rem;
    padding-bottom: 0.3rem;
    display: flex;
    .field {
      justify-content: center;
      flex: 1;
      padding-left: 0.625rem;
      padding-right: 0.625rem;
    }
    .mobile-search-input {
      flex: 1;
    }
  }
  .navbar-search-input,
  .mobile-search-input {
    input:focus,
    input:active,
    input:hover {
      border-color: rgb(219, 219, 219);
      box-shadow: inset 0 1px 2px hsla(0,0%,4%,.1);
    }
  }
}
</style>
