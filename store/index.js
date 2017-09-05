export const actions = {
  async nuxtServerInit ({ dispatch }, context) {
    await dispatch('user/initialize', context)
    await dispatch('settings/initialize', context)
  }
}
