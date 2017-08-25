export const state = () => ({
  title: null,
  updatedAt: null,
  toolBox: null
})

const mutations = {
  clear (state) {
    state.title = null
    state.updatedAt = null
    state.toolBox = null
  },
  update (state, { title, updatedAt, allowedActions, toolBox }) {
    if (title !== undefined) state.title = title
    if (updatedAt !== undefined) state.updatedAt = updatedAt
    if (toolBox !== undefined) state.toolBox = toolBox
  }
}

export default { state, mutations }
