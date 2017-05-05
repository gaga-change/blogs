/**
 * Created by 严俊东 on 2017/5/5.
 */
import axios from '~plugins/axios'
export default function ({isServer, store, req, route, res}) {
  console.log('----')
  axios.get(`/api/article/menu`).then(res => {
    store.commit('setMenus', res.data.data)
  })
}