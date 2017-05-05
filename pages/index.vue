<template>
  <div>
    <vue-head :menus="menus"/>
    <vue-banner :show="bannerShow"></vue-banner>
    <!--<vue-container></vue-container>-->
    <div class="container">
      <header class="row">
        <h4 class="pull-left">
          文章<span class="text-primary">推荐</span>
        </h4>
      </header>
      <div class="row">
        <!--左侧 文章推荐-->
        <section class="col-md-9" style="height: 300px; background-color: rgba(255,229,247,0.42)">
          <nuxt></nuxt>
        </section>
        <!--右侧最新文章列表&友情链接-->
        <aside class="col-md-3" style="height: 300px; background-color: #d7ffc1">
        </aside>
      </div>
    </div>
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

<style lang="scss" rel="stylesheet/scss" scoped>
  /*所有内容*/
  .container {
    margin-top: 20px;
    /*头部*/
    & > header {
      /*height: 10px;*/
      background: url("/img/h_line.jpg") repeat-x center;
      h4 {
        padding-right: 10px;
        background-color: #fff;
      }
    }
  }
</style>