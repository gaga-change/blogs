<template>
  <div class="c-control">
    <div class="control-black"></div>
    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container-fluid">
        <div class="navbar-header">
          <nuxt-link class="navbar-brand" to="/control">控制中心</nuxt-link>
          <nuxt-link class="navbar-brand" to="/">主站</nuxt-link>
        </div>
      </div>
    </nav>
    <div class="container-fluid">
      <div class="row">
        <!--左侧菜单-->
        <div class="col-sm-3 col-md-2 sidebar">
          <ul class="nav nav-sidebar">
            <nuxt-link to="/control" tag="li" exact><a> 网站信息 </a></nuxt-link>
            <nuxt-link to="/control/articlemenu" tag="li" exact><a> 文章类型 </a></nuxt-link>
            <nuxt-link to="/control/articleclass" tag="li" exact><a> 文章类别 </a></nuxt-link>
          </ul>
        </div>
        <!--右侧内容-->
        <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
          <nuxt></nuxt>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from '~plugins/axios'
  import NuxtLink from '../.nuxt/components/nuxt-link'
  export default {
//    middleware: 'authenticated',
    asyncData ({params, error}) {
//      return axios.get('/api/users')
//      .then((res) => {
//        console.log(res.data)
//        if(res.data.success === false) {
//          error({ statusCode: 404, message: 'User not found' })
//        } else {
//          return {
//
//          }
//        }
//      })
    },
    components: {NuxtLink},
    head () {
      return {
        title: '控制中心'
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../assets/css/dashboard.scss";
</style> 