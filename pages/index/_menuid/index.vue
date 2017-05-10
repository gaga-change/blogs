<template>
  <div>
    gaga_change {{query.name}}
    <!--{{$route.params.menu}}-->
  </div>
</template>

<script>
  /**
   * 3种情况
   * 1. 显示全部
   * 2. 显示子菜单  传一个 query.son = 1
   */
  import axios from '~plugins/axios'
  export default {
    computed: {
      query(){
        return this.$route.query
      }
    },
    asyncData ({params, error, store}) {
      return axios.get('/api/article/class', {
        params: {
          limit: 30,
          articleMenuId: params.menuid
        }
      }).then(res => {
        if (res.data.success)
          store.commit('setSonMenu', res.data.data)
        else console.error('服务器错误')
      })
    },
    watch: {
      query(){
        this.$store.commit('SET_MENU_NAME', this.query.name || '')
      }
    },
    created() {
      this.$store.commit('SET_MENU_NAME', this.query.name || '')
    }
  }
</script>

<style>

</style> 