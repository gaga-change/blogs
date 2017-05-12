export const state = {
  user: null,
  firstLoad: true,
  menuName: '',
  sonMenu: [],  // 栏目子导航
  article: null  // 博客详情
}

export const mutations = {
  // 设置博客详情
  setArticle(state, article) {
    state.article = article
  },
  // 内容右边列表中，栏位导航
  setSonMenu (state, menu) {
    state.sonMenu = menu
  },
  SET_USER (state, user) {
    if (user === '') {}
    state.user = user || null
  },
  ACTIVE (state) {
    state.firstLoad = false
  },
  /**
   * 用于设置 内容坐上脚的两个菜单按钮的右边菜单名
   * @param state
   * @param menu
   */
  SET_MENU_NAME (state, name) {
    state.menuName = name
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
