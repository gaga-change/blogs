<template>
  <div>
    <vue-head :menus="menus"/>
    <vue-banner :show="bannerShow"></vue-banner>
    <!--<vue-container></vue-container>-->
    结构区
    <nuxt></nuxt>
  </div>
</template>

<script>
  import axios from '~plugins/axios'
  import Banner from '~components/Home.Banner.vue'
  import Container from '~components/Home.Container.vue'
  export default {
    data () {
      return {
        bannerShow: this.$route.name === 'index'
      }
    },
    asyncData ({params, error}) {
      return axios.get('/api/article/menu')
      .then((res) => {
        return {
          menus: res.data.data,
        }
      })
      .catch((e) => {
        error({statusCode: 404, message: '服务器异常'})
      })
    },
    components: {
      'vue-banner': Banner,
      'vue-container': Container
    }
  }
</script>

<style >

</style>