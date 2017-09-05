import request from '~/utils/request'

export const state = () => ({
  isInitialized: false,
  data: {}
})

export const mutations = {
  initializeSuccess (state, { data }) {
    state.isInitialized = true
    state.data = data
  }
}

export const actions = {
  async initialize ({ commit }, { req, res }) {
    const resp = await request({
      path: 'public-settings',
      method: 'get',
      req,
      res
    })
    commit('initializeSuccess', { data: resp.data.publicSettings })
  }
}
