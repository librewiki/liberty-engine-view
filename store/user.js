import request from '~/utils/request'
import jwtDecode from 'jwt-decode'
import Cookies from 'js-cookie'

const unsetToken = () => {
  if (process.SERVER_BUILD) return
  Cookies.remove('jwt', { path: '/' })
}

export const state = () => ({
  isInitialized: false,
  isLoggedIn: false,
  errorMessage: null,
  id: null,
  username: null,
  email: null,
  roles: [],
  isAdmin: false,
  isBlocked: false,
  reasonOfBlock: null,
  specialPermissions: []
})

const errorMessages = {
  NO_SUCH_EMAIL: '이메일 주소가 정확하지 않습니다.',
  PASSWORD_INCORRECT: '비밀번호가 정확하지 않습니다.'
}

export const mutations = {
  block (state, isBlocked) {
    state.isBlocked = isBlocked
  },
  userProperty (state, {
    specialPermissions = [],
    isFileCreatable = false
  }) {
    state.specialPermissions = specialPermissions
    state.isFileCreatable = isFileCreatable
  },
  loginSuccess (state, decodedToken) {
    state.isInitialized = true
    state.isLoggedIn = true
    state.errorMessage = null
    state.id = decodedToken.id
    state.username = decodedToken.username
    state.email = decodedToken.email
    state.roles = decodedToken.roles
    state.isAdmin = decodedToken.isAdmin
    state.isBlockedUser = decodedToken.isBlockedUser
    state.specialPermissions = []
  },
  loginFailure (state, errorType) {
    state.isInitialized = true
    state.isLoggedIn = false
    state.errorMessage = errorMessages[errorType] || '로그인 시도 중 오류가 발생했습니다.'
    state.id = null
    state.username = null
    state.email = null
    state.roles = []
    state.isAdmin = false
    state.isBlockedUser = false
    state.specialPermissions = []
  },
  logoutSuccess (state) {
    state.isInitialized = true
    state.isLoggedIn = false
    state.errorMessage = null
    state.id = null
    state.username = null
    state.email = null
    state.roles = []
    state.isAdmin = false
    state.isBlockedUser = false
    state.specialPermissions = []
  }
}

export const actions = {
  async initializeLogin ({ commit, dispatch }, { req, res }) {
    if (process.server) {
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
  },
  async initialize ({ commit, dispatch, state }, { req, res }) {
    try {
      await dispatch('initializeLogin', { req, res })
      const { data: { isBlocked } } = await request({
        method: 'get',
        path: 'blocks/check',
        req,
        res
      })
      commit('block', isBlocked)
      if (state.id) {
        const { data: { user } } = await request({
          method: 'get',
          path: `users/${state.id}`,
          req,
          res
        })
        commit('userProperty', user)
      } else {
        commit('userProperty', {})
      }
    } catch (e) {
      unsetToken()
      commit('logoutSuccess')
    }
  }
}
