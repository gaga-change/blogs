// import { getUserFromCookie, getUserFromLocalStorage } from '~/utils/auth'
import axios from '~plugins/axios'

export default function ({isServer, store, req, route, redirect}) {

  // console.log(req)
  // If nuxt generate, pass this middleware
  // if (isServer && !req) return
  // if (req && req.user) {
  // 服务端
  // store.commit('SET_USER', req.user)
  // this.router.push({path: '/login', query: {returnPath: this.router.fullPath}})
  // }
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
  if (!isServer) {
    // console.log(encodeURIComponent(route.fullPath))
    // redirect('/login?a=1')
    //   axios.get('/api/users').then(res => {
    //     store.commit('SET_USER', res.data.data)
    //   })
    //   // 获取本地的 用户，store重新赋值
    //   window.localStorage.user
  }
  // console.log('喵喵喵')
  // const loggedUser = isServer ? getUserFromCookie(req) : getUserFromLocalStorage()
  // store.commit('SET_USER', loggedUser)
}
