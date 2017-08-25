import axios from 'axios'

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
  async initialize ({ commit }) {
    const resp = await axios({
      url: 'http://localhost:3001/public-settings',
      method: 'get'
    })
    commit('initializeSuccess', { data: resp.data.publicSettings })
  }
}
