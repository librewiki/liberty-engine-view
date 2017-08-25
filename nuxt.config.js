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
    vendor: ['babel-polyfill', 'buefy', 'axios', 'jwt-decode', 'js-cookie', 'moment'],
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
  plugins: ['~plugins/buefy', '~plugins/moment'],
  css: [
    { src: 'vue2-animate/dist/vue2-animate.min.css', lang: 'css' },
    { src: 'font-awesome/css/font-awesome.css', lang: 'css' }
    // { src: '~/assets/style.scss', lang: 'scss' }
  ],
  transition: {
    name: 'fade',
    mode: 'out-in',
    duration: '100'
  },
  router: {
    linkActiveClass: 'is-active'
  }
}
