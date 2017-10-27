import axios from 'axios'
import jwtDecode from 'jwt-decode'
import Cookies from 'js-cookie'

const prefix = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001'

async function request ({
  path,
  version = 1,
  method = 'get',
  body,
  req,
  res
}) {
  const headers = {}
  if (process.server && req) {
    const xff = req.headers['x-forwarded-for']
    headers['X-Forwarded-For'] = xff ? `${xff}, ${req.connection.remoteAddress}` : req.connection.remoteAddress
    if (req.headers.cookie) {
      const jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('jwt='))
      if (jwtCookie) {
        const token = jwtCookie.split('=')[1]
        if (token) {
          const decoded = jwtDecode(token)
          if (decoded.exp < Date.now() / 1000) {
            if (res) {
              res.setHeader('Set-Cookie', ['jwt='])
            }
          } else {
            headers.authorization = `Bearer ${token}`
          }
        }
      }
    }
  } else {
    const token = Cookies.get('jwt')
    if (token) {
      headers.authorization = `Bearer ${token}`
    }
  }
  if (path[0] === '/') {
    path = path.slice(1)
  }
  const url = `${prefix}/v${version}/${path}`
  return axios({
    url,
    method,
    data: body,
    headers
  })
}

export default request
