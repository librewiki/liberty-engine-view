'use strict'

module.exports = {
  apps: [
    {
      name: 'Liberty frontend',
      script: 'node_modules/.bin/nuxt start',
      env: {
        PORT: 3080,
        COMMON_VARIABLE: 'true',
        NODE_ENV: 'production'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
}
