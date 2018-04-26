const helmet = require('helmet')

const defaultSrc = process.env.NODE_ENV === 'production'
  ? ["'self'", 'data:', 'www.gravatar.com']
  : ["'self'", 'data:', 'www.gravatar.com', 'localhost:3001']

module.exports = helmet({
  frameguard: {
    action: 'deny'
  },
  hsts: {
    maxAge: 63072000,
    includeSubDomains: true,
    preload: true
  },
  contentSecurityPolicy: {
    directives: {
      frameAncestors: ["'none'"],
      defaultSrc,
      fontSrc: ["'self'", 'cdnjs.cloudflare.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com'],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      mediaSrc: ['*'],
      objectSrc: ["'none'"],
      workerSrc: ["'self'"]
    }
  }
})
