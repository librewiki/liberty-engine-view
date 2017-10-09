export const state = () => ({
  title: null,
  updatedAt: null,
  toolBox: null,
  redirectedFrom: null,
  oldRevision: null
})

export const mutations = {
  clear (state) {
    state.title = null
    state.updatedAt = null
    state.toolBox = null
    state.redirectedFrom = null
    state.oldRevision = null
  },
  update (state, { title, updatedAt, toolBox, redirectedFrom, oldRevision }) {
    if (title !== undefined) state.title = title
    if (updatedAt !== undefined) state.updatedAt = updatedAt
    if (toolBox !== undefined) state.toolBox = toolBox
    if (redirectedFrom !== undefined) state.redirectedFrom = redirectedFrom
    if (oldRevision !== undefined) state.oldRevision = oldRevision
  }
}
