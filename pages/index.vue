<template>
  <div>
    <vue-head :menus="menus"/>
    <vue-banner :show="bannerShow"></vue-banner>
    <!--<vue-container></vue-container>-->
    <div class="container">
      <header class="row" v-if="bannerShow">
        <h4 class="pull-left">
          文章<span class="text-primary">推荐</span>
        </h4>
      </header>
      <h4 class="t_nav" v-if="!bannerShow">
        <!--<span>“慢生活”不是懒惰，放慢速度不是拖延时间，而是让我们在生活中寻找到平衡。</span>-->
        <nuxt-link to="/" class="n1">网站首页</nuxt-link>
        <a href="javascript:void(0)" class="n2">{{menuName}}</a>
      </h4>
      <div class="row">
        <!--左侧 文章推荐-->
        <section class="col-md-9 left-list">
          <nuxt></nuxt>
        </section>
        <!--右侧最新文章列表&友情链接-->
        <aside class="col-md-3">
          {{$route.params.menuid}}
          <div class="rnav clearfix" v-if="sonMenu.length > 0 && $route.params.menuid">
            <h2>栏目导航</h2>
            <ul>
              <li v-for="item in sonMenu">
                <nuxt-link
                  :to="{name: 'index-menu-menuid', params: {menuid: $route.params.menuid}, query: {name: item.name, son: 1} }"
                  v-text="item.name"></nuxt-link>
              </li>
            </ul>
          </div>
          <div class="right-list">
            <h4><span>最新<span class="text-primary">文章</span></span></h4>
            <ul class="new-article">
              <li v-for="item in newArticle">
                <a href="#" v-text="item.title"></a>
              </li>
            </ul>
            <h4><span>点击<span style="color: rgba(199,0,199,0.73)">排行</span></span></h4>
            <ul class="hot-article">
              <li v-for="item in hotArticle">
                <a href="#" v-text="item.title"></a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from '~plugins/axios'
  import Banner from '~components/Home.Banner.vue'
  import Container from '~components/Home.Container.vue'
  import NuxtLink from '../.nuxt/components/nuxt-link'
  export default {
    data () {
      return {
        bannerShow: this.$route.name === 'index',
      }
    },
    computed: {
      menuName() {
        return this.$store.state.menuName
      },
      sonMenu () {
        return this.$store.state.sonMenu
      }
    },
    asyncData ({params, error}) {
      return axios.get('/api/article/menu')
      .then((resMenu) => {
        return axios.get('/api/article', {
          params: {
            limit: 10
          }
        }).then(newResArticle => {
          return axios.get('/api/article', {
            params: {
              limit: 9,
              hot: -1
            }
          }).then(hotResArticle => {
            return {
              menus: resMenu.data.data,
              newArticle: newResArticle.data.articles,
              hotArticle: hotResArticle.data.articles
            }
          })
        })
      })
      .catch((e) => {
        error({statusCode: 404, message: '服务器异常'})
      })
    },
    components: {
      NuxtLink,
      'vue-banner': Banner,
      'vue-container': Container
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  /*栏目导航*/
  .rnav {
    margin: 0;
    /*overflow: hidden;*/
    background: url(/images/6167.png) no-repeat left top #fff;
    /*position: fixed;*/
    position: relative;
    z-index: 1;
    ul {
      padding: 0;
    }
    h2 {
      font-size: 16px;
      font-weight: 500;
      padding-left: 40px;
      line-height: 30px;
      height: 30px;
      margin-top: 0;
      margin-bottom: 10px;
    }
    li {
      position: relative;
      width: 100%;
      text-align: center;
      display: inline-block;
      margin-bottom: 5px;
      margin-right: 5px;
      float: left;
      height: 40px;
      line-height: 38px;
      background-color: white;
      a {
        color: #333;
        display: block;
        -webkit-transition: all 1s;
        -moz-transition: all 1s;
        -o-transition: all 1s;
        transition: all 0.1s;
        border: #CCC 1px solid;
        text-decoration: none;
        &:before {
          position: absolute;
          z-index: -1;
          content: '';
          top: calc(50% - 10px);
          left: 0;
          border-style: solid;
          border-width: 10px 10px 10px 0;
          border-color: transparent #e1e1e1 transparent transparent;
          -webkit-transition-duration: 0.3s;
          transition-duration: 0.3s;
          -webkit-transition-property: transform;
          transition-property: transform;
        }
        &:hover, &:active {
          -webkit-transform: translateX(10px);
          transform: translateX(10px);
          &:before {
            -webkit-transform: translateX(-10px);
            transform: translateX(-10px);
          }
        }
      }
    }
  }

  .t_nav {
    border-bottom: #F1F1F1 1px solid;
    font-size: 16px;
    font-weight: normal;
    line-height: 40px;
    height: 40px;
    span {
      float: right;
      color: #999;
    }
    a {
      width: 100px;
      display: block;
      text-align: center;
      color: #fff;
      float: left;
    }
    a:hover {
      text-decoration: none;
      color: #333;
    }
    .n1 {
      background: #5EA51B;
    }
    .n2 {
      background: #8BBF5D;
    }
  }

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
    .left-list {
      background: url("/images/r_line.jpg") repeat-y right;

    }
  }

  /*最新文章列表*/
  .new-article {
    padding: 0;
    margin-bottom: 30px;
    li {
      height: 25px;
      line-height: 25px;
      clear: both;
      padding-left: 15px;
      background: url(/images/li.jpg) no-repeat left center;
    }
    a {
      display: block;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      padding-right: .2rem;
      color: #222;
    }
  }

  /*点击排行*/
  .hot-article {
    background: url(/images/ph.jpg) no-repeat left 8px;
    margin: 10px 0 20px;
    padding: 0;
    list-style: none;
    li {
      line-height: 31px;
      height: 31px;
      overflow: hidden;
      padding-left: 24px;
      border-bottom: #CCC dotted 1px;
    }
    a {
      text-decoration: none;
      display: block;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      padding-right: .2rem;
      color: #222;
    }
  }

  .right-list h4 {
    /*font-size: 14px;*/
    & > span {
      padding-right: 6px;
      background-color: #fff;
    }
    background: url(/images/r_title_bg.jpg) repeat-x center;
  }
</style>