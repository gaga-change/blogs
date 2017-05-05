<template>
  <div>
    <h2 class="sub-header">
      文章列表
      <button class="btn btn-info" type="button" @click="btnSearch">查询</button>
      <nuxt-link class="btn btn-info"
                 :to="{name:'control-articleDetail-articleID', params: {articleID: 'add'}}"
      >添加
      </nuxt-link>
    </h2>
    <div>
      标题：<input type="text" placeholder="标题" v-model="searchTitle">
      类型：
      <select name="" v-model="searchMenu">
        <option :value="null" selected>全部</option>
        <option v-for="item in articleMenus" :value="item._id" v-text="item.name"></option>
      </select>
      <span v-if="searchMenu">类别：</span>
      <select name="" v-model="searchClass" v-if="searchMenu">
        <option :value="null">全部</option>
        <option v-for="item in articleClassesFilter" :value="item._id" v-text="item.name"></option>
      </select>
      推荐：
      <select v-model="searchPush">
        <option :value="null">全部</option>
        <option :value="true">推荐的</option>
        <option :value="false">不推荐的</option>
      </select>
      点击量排序：
      <select v-model="searchHot">
        <option :value="null">全部</option>
        <option :value="-1">从大到小</option>
        <option :value="1">从小到大</option>
      </select>
    </div>
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
        <tr>
          <th>index</th>
          <th>标题</th>
          <th>类型</th>
          <th>类别</th>
          <th>推荐</th>
          <th>点击量</th>
          <th>创建时间</th>
          <th>更新时间</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,index) in articles">
          <td v-text="index + 1"></td>
          <td>
            <span v-text="item.title"></span>
          </td>
          <td>
            <span v-text="item.articleClass.name"></span>
          </td>
          <td>
            <span v-text="item.articleMenu.name"></span>
          </td>
          <td>
            <span v-text="item.push"></span>
          </td>
          <td>
            <span v-text="item.clickNum"></span>
          </td>
          <td> {{ item.createDate | prettyTime}}</td>
          <td> {{ item.updateDate | prettyTime}}</td>
          <td>
            <a class="btn" @click="goDel(item)">删除</a>
            <nuxt-link class="btn"
                       :to="{name:'control-articleDetail-articleID', params: {articleID: item._id}}"
            >修改
            </nuxt-link>
            <a v-if="!item.push" v class="btn" @click="goPush(item, true)">推荐</a>
            <a v-if="item.push" v class="btn" @click="goPush(item, false)">不推荐</a>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <hr>
    <nav aria-label="Page navigation ">
      <ul class="pagination">
        <li><a> 总：<span v-text="count"></span>条</a></li>
        <li v-if="page > 3 && pages > 5">
          <a href="javescript:void(0)" @click="getUserList(1)">
            <span><<</span>
          </a>
        </li>
        <li v-if="page > 1">
          <a href="javascript:void(0)" @click="getUserList(page - 1)">
            <span><</span>
          </a>
        </li>
        <li v-for="item in myPages" :class="{'active': item === page }">
          <a href="javascript:void(0)" @click="getUserList(item)">{{item}}</a>
        </li>
        <li v-if="page < pages">
          <a href="javascript:void(0)" @click="getUserList(page + 1)">
            <span>></span>
          </a>
        </li>
        <li v-if="page < pages - 2 && pages > 5">
          <a href="javascript:void(0)" @click="getUserList(pages)">
            <span>>></span>
          </a>
        </li>
      </ul>
    </nav>
    <modal
      :ifShow="showModal"
      title="确定要删除吗？"
      :content="modalContent"
      @close="showModal=false"
      @confirm="confirmDel"
    ></modal>
  </div>
</template>

<script>
  import axios from '~plugins/axios'
  import Modal from '~components/Modal'
  import NuxtLink from '../../.nuxt/components/nuxt-link'
  export default {
    asyncData ({params, error}) {
      return axios.get('/api/article', {
        params: {
          limit: 10,
          page: 1
        }
      }).then((res) => {
        return {
          articles: res.data.articles,
          articleMenus: null,
          articleClasses: null,
          showModal: false,
          modalContent: '',
          checkItem: null,
          count: res.data.count,
          limit: 10,
          page: 1,
          pages: res.data.pages,
          searchTitle: '',
          searchClass: null,
          searchMenu: null,
          searchPush: null,
          searchHot: null
        }
      }).catch((e) => {
        error({statusCode: 404, message: 'Article not found'})
      })
    },
    watch: {
      searchMenu (value) {
        if (value === null) this.searchClass = null
      }
    },
    computed: {
      articleClassesFilter () {
        return this.articleClasses.filter(v => {
          return v.articleMenu._id === this.searchMenu
        })
      },
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
      }
    },
    created () {
      axios.get('/api/article/class').then(res => {
        this.articleClasses = res.data.data
      })
      axios.get('/api/article/menu').then(res => {
        this.articleMenus = res.data.data
      })
    },
    methods: {
      // 点击删除，显示提示框
      goDel (item) {
        this.checkItem = item
        this.showModal = true
        this.modalContent = 'title:  ' + item.title
      },
      // 提示框点击确认后，然后删除数据
      confirmDel () {
        axios.delete('/api/article/' + this.checkItem._id).then(res => {
          if (!res) return
          res = res.data
          if (res.success) {
            this.articles = this.articles.filter(v => {
              return v._id !== this.checkItem._id
            })
          } else {
            alert('删除失败，请重试！')
          }
        })
      },
      // 点击 查询后，重新查询，并重新赋值
      btnSearch () {
        this.getUserList(this.page)
      },
      // 根据页码获取 列表
      getUserList (page) {
        axios.get('/api/article', {
          params: {
            limit: this.limit,
            page: page,
            articleClassId: this.searchClass,
            title: this.searchTitle === '' ? null : this.searchTitle,
            articleMenuId: this.searchMenu,
            push: this.searchPush,
            hot: this.searchHot
          }
        }).then(res => {
          this.articles = res.data.articles
          this.pages = res.data.pages
          this.page = page
          this.count = res.data.count
        })
      },
      /**
       * 添加至推荐
       */
      goPush(item, boolean) {
        axios.put('/api/article/' + item._id + '/' + item.articleClass._id + '/put', {
          push: boolean,
        }).then(res => {
          if (res.data.success) {
//            alert('更新成功')
            item.push = boolean
          } else {
            alert('更新失败请重试！')
          }
        })
      }
    },
    components: {
      NuxtLink,
      Modal
    },
    head () {
      return {
        title: `控制中心-文章列表`
      }
    }
  }
</script>

<style scoped>
  .pagination {
    display: block;
    text-align: center;
  }

  .pagination > li > a {
    float: none;
  }

  .pagination > li {
  }
</style>