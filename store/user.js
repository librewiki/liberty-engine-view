import request from '~/utils/request'
import jwtDecode from 'jwt-decode'
import Cookies from 'js-cookie'

const setToken = (token) => {
  if (process.SERVER_BUILD) return
  Cookies.set('jwt', token)
}

const unsetToken = () => {
  if (process.SERVER_BUILD) return
  Cookies.remove('jwt')
}

export const state = () => ({
  isInitialized: false,
  pending: false,
  isLoggedIn: false,
  errorMessage: null,
  id: null,
  username: null,
  email: null,
  roles: [],
  isAdmin: false,
  isBlockedUser: false,
  isBlockedIp: false,
  reasonOfBlock: null
})

const errorMessages = {
  NO_SUCH_EMAIL: '이메일 주소가 정확하지 않습니다.',
  PASSWORD_INCORRECT: '비밀번호가 정확하지 않습니다.'
}

export const mutations = {
  block (state, isBlockedIp) {
    state.isBlockedIp = isBlockedIp
  },
  loginStart (state) {
    state.pending = true
  },
  loginSuccess (state, decodedToken) {
    state.pending = false
    state.isLoggedIn = true
    state.errorMessage = null
    state.id = decodedToken.id
    state.username = decodedToken.username
    state.email = decodedToken.email
    state.roles = decodedToken.roles
    state.isAdmin = decodedToken.isAdmin
    state.isBlockedUser = decodedToken.isBlockedUser
  },
  loginFailure (state, errorType) {
    state.pending = false
    state.isLoggedIn = false
    state.errorMessage = errorMessages[errorType] || '로그인 시도 중 오류가 발생했습니다.'
    state.id = null
    state.username = null
    state.email = null
    state.roles = []
    state.isAdmin = false
    state.isBlockedUser = false
  },
  logoutSuccess (state) {
    state.pending = false
    state.isLoggedIn = false
    state.errorMessage = null
    state.id = null
    state.username = null
    state.email = null
    state.roles = []
    state.isAdmin = false
    state.isBlockedUser = false
  }
}

export const actions = {
  async login ({ commit }, { username, password }) {
    try {
      commit('loginStart')
      const resp = await request({
        method: 'post',
        path: 'authentication',
        body: { username, password }
      })
      const { token } = resp.data
      const decoded = jwtDecode(token)
      setToken(token)
      commit('loginSuccess', decoded)
    } catch (err) {
      unsetToken()
      if (err.response) {
        commit('loginFailure', err.response.data.type)
      } else {
        commit('loginFailure')
      }
    }
  },
  logout ({ commit }) {
    unsetToken()
    commit('logoutSuccess')
    history.go(0)
  },
  async initialize ({ commit }, { req, res, isServer }) {
    try {
      if (isServer) {
        if (!req) return
        if (!req.headers.cookie) return
        const jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('jwt='))
        if (!jwtCookie) return
        const token = jwtCookie.split('=')[1]
        if (!token) return
        const decoded = jwtDecode(token)
        if (!decoded || decoded.exp < Date.now() / 1000) { // if expired
          return
        }
        commit('loginSuccess', decoded)
      } else {
        const token = Cookies.get('jwt')
        if (!token) return
        const decoded = jwtDecode(token)
        if (!decoded) return
        if (decoded.exp < Date.now() / 1000) { // if expired
          unsetToken()
        }
        commit('loginSuccess', decoded)
      }
      const resp = await request({
        method: 'get',
        path: 'block/check'
      })
      commit('block', resp.data.isBlockedIp)
    } catch (e) {
      unsetToken()
      commit('logoutSuccess')
    }
  }
}
