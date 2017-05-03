// import { getUserFromCookie, getUserFromLocalStorage } from '~/utils/auth'
import axios from '~plugins/axios'
const only = require('only')
axios.interceptors.response.use(function (res) {
  if (typeof window === 'object') {
    if (res.data.goLogin) {
      /**
       * 非法操作（用户已经退出 或 权限不够）
       * @type {string}
       */
      location.href = '/login'
    } else {
      return res
    }
  } else {
    return res
  }
})
export default function ({isServer, store, req, route, res}) {
  /**
   * 如果是服务端，则在store中 保存用户信息。
   * 如果是客户端，则通过LS 拉取用户信息。（登入成功的时候会保留用户在本地）
   */
  if (req && req.user) {
    // 服务端
    store.commit('SET_USER', only(req.user, '_id name email isMaster'))
  }
  if (!isServer) {
    /**
     * 判断是否为第一次 客户端切换
     *   是: store.user 赋值给  ls.user
     *   否： ls.user 赋值给 store.user
     */
    if (store.getters.isFirst) {
      if (store.state.user) {
        window.localStorage.setItem('user', JSON.stringify(store.state.user))
      } else {
        window.localStorage.removeItem('user')
      }
    } else {
      store.commit('SET_USER', window.localStorage.user ? JSON.parse(window.localStorage.user) : null)
    }
  }
  if (route.fullPath.split('/')[1] === 'control') {
    /**
     * 获取该接口是否满足 登入&&最高权限
     */
    if (!isServer) {
    }
  }
}
