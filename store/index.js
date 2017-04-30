export const state = {
  user: null
}

export const mutations = {
  SET_USER (state, user) {
    if (user === '') {}
    state.user = user || null
  }
}

export const getters = {
  isAuthenticated (state) {
    return !!state.user
  },
  loggedUser (state) {
    return state.user
  },
  isMaster (state) {
    return !!state.user && !!state.user.isMaster
  }
}
