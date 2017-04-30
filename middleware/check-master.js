/**
 * Created by gaga on 2017/4/30.
 */
export default function ({store, redirect}) {
  if (!store.getters.isMaster) {
    return redirect('/login')
  }
}
