module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'nuxt-liberty',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'LibertyEngine view' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    vendor: ['babel-polyfill', 'buefy', 'axios', 'jwt-decode', 'js-cookie', 'moment', 'diff', 'diff2html'],
    /*
    ** Run ESLINT on save
    */
    extend (config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  plugins: ['~plugins/matchesPolyfill', '~plugins/buefy', '~plugins/moment'],
  css: [
    { src: 'vue2-animate/dist/vue2-animate.min.css', lang: 'css' },
    { src: 'font-awesome/css/font-awesome.css', lang: 'css' },
    { src: 'diff2html/dist/diff2html.css', lang: 'css' }
  ],
  transition: {
    name: 'fade',
    mode: 'out-in',
    duration: '100'
  },
  router: {
    linkActiveClass: 'is-active',
    scrollBehavior (to, from, savedPosition) {
      // savedPosition is only available for popstate navigations.
      if (savedPosition) {
        return savedPosition
      } else {
        let position = {}
        // if no children detected
        if (to.matched.length < 2) {
          // scroll to the top of the page
          position = { x: 0, y: 0 }
        } else if (to.matched.some((r) => r.components.default.options.scrollToTop)) {
          // if one of the children has scrollToTop option set to true
          position = { x: 0, y: 0 }
        }
        // if link has anchor,  scroll to anchor by returning the selector
        if (to.hash) {
          position = { selector: to.hash.replace(/\./g, '\\.') }
          setTimeout(() => {
            scrollBy({ top: -50, behavior: 'smooth' })
          }, 100)
        }
        return position
      }
    }
  }
}
