<template>
  <div>
    <ul class="list">
      <li class="item" v-for="item in articles">
        <h2>
          <a :title="item.title" href="#" v-text="item.title"></a>
        </h2>
        <p class="dateview">
          <span>发布时间：{{item.createDate | prettyTime02}}</span>
          <span>作者：{{item.author}}</span>
          <span>[<a href="/download/div/" v-text="item.articleClass.name"></a>]</span>
        </p>
        <figure v-if="item.imageUrl">
          <a :title="item.title" href="#">
            <img :src="item.imageUrl" :alt="item.title"></a>
        </figure>
        <div class="nlist">
          <p v-text="item.intro"></p>
          <a href="#" target="_blank" :title="item.title" class="readmore">详细信息&gt;&gt;</a>
        </div>
        <div class="line"></div>
      </li>
    </ul>
    <!--页码-->
    <nav aria-label="Page navigation ">
      <ul class="pagination">
        <li><a> 总：<span v-text="count"></span>条</a></li>
        <li v-if="page > 3 && pages > 5">
          <nuxt-link
            :to="{ name: 'index-menu-menuid',params: {menuid: params.menuid},query: {page: 1, name: query.name} } ">
            <span><<</span>
          </nuxt-link>
        </li>
        <li v-if="page > 1">
          <nuxt-link
            :to="{ name: 'index-menu-menuid',params: {menuid: params.menuid},query: {name: query.name, page: page - 1} } ">
            <span><</span>
          </nuxt-link>
        </li>
        <li v-for="item in myPages" :class="{'active': item === page }">
          <nuxt-link
            :to="{ name: 'index-menu-menuid',params: {menuid: params.menuid},query: {name: query.name, page: item} } ">{{item}}
          </nuxt-link>
        </li>
        <li v-if="page < pages">
          <nuxt-link
            :to="{ name: 'index-menu-menuid',params: {menuid: params.menuid},query: {name: query.name, page: page + 1} } ">
            <span>></span>
          </nuxt-link>
        </li>
        <li v-if="page < pages - 2 && pages > 5">
          <nuxt-link
            :to="{ name: 'index-menu-menuid',params: {menuid: params.menuid},query: {name: query.name, page: pages} } ">
            <span>>></span>
          </nuxt-link>
        </li>
      </ul>
    </nav>
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
    data() {
      return {
        articles: [],
        count: 0,
        limit: 10,
        page: 1,
        pages: 1,
      }
    },
    asyncData ({params, error, store, query}) {
      const page = Number(query.page) || 1
      return axios.get('/api/article/class', {
        params: {
          limit: 30,
          articleMenuId: params.menuid
        }
      }).then(res => {
        if (res.data.success) {
          /**
           * 让父组件（page/index.vue）显示最新子菜单
           */
          store.commit('setSonMenu', res.data.data)
          // 获取列表（主要内容）
          return axios.get('/api/article', {
            params: {
              page: page,
              limit: 10,
              articleMenuId: params.menuid,
              articleClassId: query.articleClassId
            }
          }).then(res => {
            if (res.data.success) {
              return {
                articles: res.data.articles,
                count: res.data.count,
                limit: 10,
                page: page,
                pages: res.data.pages,
              }
            } else {
              console.error('服务器错误--初始列表')
            }
          })
        }
        else {
          console.error('请求错误错误--子菜单')
          console.log(params)
        }
      })
    },
    watch: {
      query(){
        this.$store.commit('SET_MENU_NAME', this.query.name || '')
      }
    },
    computed: {
      myPages () {
        if (this.pages < 5) {
          let ret = []
          for (let i = 1; i <= this.pages; i++) {
            ret.push(i)
          }
          return ret
        }
        let middle = 3
        if (this.page > 3) middle = this.page
        if (this.page > this.pages - 2) middle = this.pages - 2
        return [
          // 1 2 3 4 5 6 7
          (this.page < 3) ? 1 : (middle - 2),
          (this.page < 3) ? 2 : (middle - 1),
          (this.page < 3) ? 3 : middle,
          (this.page > (this.pages - 2)) ? (this.pages - 1) : (middle + 1),
          (this.page > (this.pages - 2)) ? this.pages : (middle + 2)
        ]
      },
      query(){return this.$route.query},
      params(){
        return this.$route.params
      }
    },
    created() {
      this.$store.commit('SET_MENU_NAME', this.query.name || '')

    },
    methods: {
      // 根据页码获取 列表
      getUserList (page) {
        axios.get('/api/article', {
          params: {
            limit: this.limit,
            page: page,
            articleMenuId: this.$route.params.menuid
          }
        }).then(res => {
          this.articles = res.data.articles
          this.pages = res.data.pages
          this.page = page
          this.count = res.data.count
        }, () => {
          console.log('翻页接口处错')
        })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  ul.list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li.item {
    position: relative;
    h2 {
      color: #333;
      font-size: 16px;
      margin: 20px 0 10px 0;
      clear: both;
    }
    .dateview {
      color: #756F71;
      & > span {
        font-size: 70%;
        margin: 0 10px 0 0;
      }
    }
    figure {
      float: left;
      margin-right: 10px;
    }
    .nlist {
      line-height: 1.9;
      a.readmore {
        position: absolute;
        right: 20px;
        bottom: 10px;
        background: #f90;
        color: #fff;
        padding: 5px 10px;
        float: right;
        margin: 20px 0 0 0;
      }
    }
    .line {
      overflow: hidden;
      width: 100%;
      height: 20px;
      border-bottom: 1px dashed #ccc;
    }
  }
</style> 