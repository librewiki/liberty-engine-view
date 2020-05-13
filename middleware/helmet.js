import helmet from 'helmet'

export default helmet({
  frameguard: {
    action: 'deny'
  },
  hsts: {
    maxAge: 63072000,
    includeSubDomains: true,
    preload: true
  }
})
