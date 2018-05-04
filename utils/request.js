import axios from 'axios'
import jwtDecode from 'jwt-decode'
import Cookies from 'js-cookie'
import qs from 'qs'

const serverSideApiPath = `http://localhost:${process.env.API_PORT || '3001'}`
const clientSideApiPath = process.env.NODE_ENV === 'production' ? '/api' : serverSideApiPath

async function serverSideRequest ({
  path,
  version = 1,
  method = 'get',
  body,
  req,
  res
}) {
  const headers = {}
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
  if (path[0] === '/') {
    path = path.slice(1)
  }
  const url = `${serverSideApiPath}/v${version}/${path}`
  return axios({
    url,
    method,
    data: body,
    headers
  })
}

async function clientSideRequest ({
  path,
  version = 1,
  method = 'get',
  body
}) {
  const headers = {}
  const token = Cookies.get('jwt')
  if (token) {
    headers.authorization = `Bearer ${token}`
  }
  if (path[0] === '/') {
    path = path.slice(1)
  }
  const url = `${clientSideApiPath}/v${version}/${path}`
  return axios({
    url,
    method,
    data: body,
    headers
  })
}

async function request ({
  path,
  version = 1,
  method = 'get',
  query,
  body,
  req,
  res
}) {
  if (query) {
    path += '?' + qs.stringify(query)
  }
  if (process.server) {
    if (!req || !res) {
      throw new Error('Must pass req and res')
    }
    return serverSideRequest({
      path,
      version,
      method,
      body,
      req,
      res
    })
  } else {
    return clientSideRequest({
      path,
      version,
      method,
      body
    })
  }
}

export default request
