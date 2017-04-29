// import { getUserFromCookie, getUserFromLocalStorage } from '~/utils/auth'
// import axios from '~plugins/axios'

export default function ({isServer, store, req, route, res}) {
  // console.log(req)
  // If nuxt generate, pass this middleware
  // if (isServer && !req) return
  /**
   * 如果是服务端，则在store中 保存用户信息。
   * 如果是客户端，则通过LS 拉取用户信息。（登入成功的时候会保留用户在本地）
   */
  if (req && req.user) {
    // 服务端
    store.commit('SET_USER', req.user)
    // window.localStorage.setItem('user', JSON.stringify(req.user))
    // this.router.push({path: '/login', query: {returnPath: this.router.fullPath}})
  }
  if (!isServer) {
    store.commit('SET_USER', window.sessionStorage.user ? JSON.parse(window.sessionStorage.user) : null)
  }
  if (route.fullPath.split('/')[1] === 'control') {
    /**
     * 获取该接口是否满足 登入&&最高权限
     */
    if (!isServer) {
      // console.log(encodeURIComponent(route.fullPath))
      // redirect('/login?fullPath=' + encodeURIComponent(route.fullPath))
      //   axios.get('/api/users').then(res => {
      //     store.commit('SET_USER', res.data.data)
      //   })
      //   // 获取本地的 用户，store重新赋值
      //   window.localStorage.user
    }
  }
  // // 本地
  // if (!isServer) {
  // console.log(encodeURIComponent(route.fullPath))
  // redirect('/login?a=1')
  //   axios.get('/api/users').then(res => {
  //     store.commit('SET_USER', res.data.data)
  //   })
  //   // 获取本地的 用户，store重新赋值
  //   window.localStorage.user
  // }
  // console.log('喵喵喵')
  // const loggedUser = isServer ? getUserFromCookie(req) : getUserFromLocalStorage()
  // store.commit('SET_USER', loggedUser)
}
