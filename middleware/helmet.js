const helmet = require('helmet')

module.exports = helmet({
  frameguard: {
    action: 'deny'
  },
  hsts: {
    maxAge: 63072000,
    includeSubDomains: true,
    preload: true
  }
})
