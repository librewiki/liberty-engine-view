import helmet from 'helmet'

const defaultSrc = process.env.NODE_ENV === 'production'
  ? ["'self'", 'data:', 'www.gravatar.com']
  : ["'self'", 'data:', 'www.gravatar.com', `http://localhost:${process.env.API_PORT || '3001'}`]

export default helmet({
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
      fontSrc: ["'self'", 'cdnjs.cloudflare.com', 'cdn.jsdelivr.net'],
      styleSrc: ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com', 'cdn.jsdelivr.net'],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      mediaSrc: ['*'],
      objectSrc: ["'none'"],
      workerSrc: ["'self'"]
    }
  }
})
