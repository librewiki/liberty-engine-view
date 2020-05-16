module.exports = {
  env: {
    API_PORT: process.env.API_PORT || '3001'
  },
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
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/katex@0.10.0/dist/katex.css',
        integrity: 'sha384-xNwWFq3SIvM4dq/1RUyWumk8nj/0KFg4TOnNcfzUU4X2gNn3WoRML69gO7waf3xh',
        crossorigin: 'anonymous'
      },
      {
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/github.min.css',
        integrity: 'sha384-WtUWHyk39lfUpZQVgokNfSKCJaKAeD6adgLduBLrKTMUuPzFhLtL23y1guFy6lZn',
        crossorigin: 'anonymous'
      }
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
    /*
    ** Run ESLINT on save
    */
    extend (config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  serverMiddleware: [
    '~/middleware/helmet'
  ],
  plugins: [
    { src: '~plugins/matchesPolyfill', ssr: false },
    '~plugins/buefy',
    '~plugins/vue-form-generator',
    '~plugins/moment',
    '~plugins/vue-gravatar',
    { src: '~plugins/eventHub', ssr: false }
  ],
  css: [
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
    scrollBehavior: (to, from, savedPosition) => {
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
