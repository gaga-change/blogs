export const state = {
  user: null,
  firstLoad: true
}

export const mutations = {
  SET_USER (state, user) {
    if (user === '') {}
    state.user = user || null
  },
  ACTIVE (state) {
    state.firstLoad = false
  }
}

export const getters = {
  isFirst (state) {
    return state.firstLoad
  },
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
