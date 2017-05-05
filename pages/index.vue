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
        <section class="col-md-9 left-list">
          <nuxt></nuxt>
        </section>
        <!--右侧最新文章列表&友情链接-->
        <aside class="col-md-3">
          <div class="right-list">
            <h4><span>最新<span class="text-primary">文章</span></span></h4>
            <ul class="new-article">
              <li v-for="item in newArticle">
                <a href="#" v-text="item.title"></a>
              </li>
            </ul>
            <h4><span>最新<span style="color: rgba(199,0,199,0.73)">排序</span></span></h4>
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
  export default {
    data () {
      return {
        bannerShow: this.$route.name === 'index'
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
    &> span {
      padding-right: 6px;
      background-color: #fff;
    }
    background: url(/images/r_title_bg.jpg) repeat-x center;
  }
</style>