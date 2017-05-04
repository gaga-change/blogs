<template>
  <div>
    <h1>
      <a class="btn" type="button" @click="$router.go(-1)">返回</a>
      <span>{{isAdd ? '文章添加' : '文章修改'}}</span>
    </h1>
    <form class="form-horizontal">
      <div class="form-group">
        <label for="titleId" class="col-sm-2 control-label">标题</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="titleId" placeholder="标题" v-model="article.title">
        </div>
      </div>
      <div class="form-group">
        <label for="introId" class="col-sm-2 control-label">简介</label>
        <div class="col-sm-10">
          <textarea class="form-control" id="introId" cols="30" rows="10" v-model="article.intro"></textarea>
        </div>
      </div>
      <div class="form-group">
        <label for="imgUrl" class="col-sm-2 control-label">图片路径</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="imgUrl" placeholder="图片路径" v-model="article.imageUrl">
        </div>
      </div>
      <div class="form-group">
        <label for="authorId" class="col-sm-2 control-label">作者</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="authorId" placeholder="作者" v-model="article.author">
        </div>
      </div>
      <div class="form-group">
        <label for="menuId" class="col-sm-2 control-label">类型</label>
        <div class="col-sm-10">
          <select id="menuId" class="form-control" v-model="article.articleMenu">
            <option v-for="item in articleMenus" :value="item._id" v-text="item.name"></option>
          </select>
        </div>
      </div>
      <div class="form-group" v-if="article.articleMenu">
        <label for="classId" class="col-sm-2 control-label">类别</label>
        <div class="col-sm-10">
          <select id="classId" class="form-control" v-model="article.articleClass">
            <option v-for="item in articleClassesFilter" :value="item._id" v-text="item.name"></option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label for="classId" class="col-sm-2 control-label">内容</label>
        <div class="col-sm-10">
          <div class="row">
            <div class="col-sm-6">
              <textarea class="form-control" name="" cols="30" style="height: 600px; overflow: auto"
                        v-model="article.content"
              ></textarea>
            </div>
            <div class="col-sm-6">
              <div v-html="resultContent" style="border: 1px silver solid;height: 600px; overflow: auto; border-radius: 5px">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-offset-2 col-sm-10">
          <button v-if="!isAdd" type="button" class="btn btn-info" @click="update">更新</button>
          <button v-if="isAdd" type="button" class="btn btn-info" @click="addArticle">提交</button>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
  import axios from '~plugins/axios'
  const MarkdownIt = require('markdown-it')
  const md = new MarkdownIt();
  export default {
    name: 'ArticleDetail',
    data() {
      return {
        isAdd: false,
        articleClasses: [],
        articleMenus: [],
        article: {
          _id: '',
          title: '',
          intro: '',
          author: '',
          content: '',
          imageUrl: '',
          articleClass: null,
          articleMenu: null
        }
      }
    },
    asyncData ({params, error}) {
      if (params.articleID === 'add') {
        return {
          isAdd: true,
          articleClasses: [],
          articleMenus: [],
          article: {
            _id: '',
            title: '',
            intro: '',
            author: '',
            content: '',
            imageUrl: '',
            articleClass: null,
            articleMenu: null
          }
        }
      } else {
        return axios.get('/api/article', {
          params: {
            item: params.articleID
          }
        }).then(res => {
          res = res.data.articles[0]
          return {
            isAdd: false,
            article: {
              _id: res._id,
              title: res.title,
              intro: res.intro,
              author: res.author,
              content: res.content,
              imageUrl: res.imageUrl,
              articleClass: res.articleClass._id,
              articleMenu: res.articleMenu
            }
          }
        })
      }
    },
    computed: {
      articleClassesFilter () {
        return this.articleClasses.filter(v => {
          return v.articleMenu._id === this.article.articleMenu
        })
      },
      resultContent () {
        return md.render(this.article.content)
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
      update() {
        axios.put('/api/article/' + this.article._id + '/' + this.article.articleClass + '/put', {
          title: this.article.title,
          intro: this.article.intro,
          author: this.article.author,
          content: this.article.content,
          imageUrl: this.article.imageUrl
        }).then(res => {
          if (res.data.success) {
            alert('更新成功')
          } else {
            alert('更新失败请重试！')
          }
        })
      },
      addArticle () {
        axios.post('/api/article/' + this.article.articleClass + '/add', {
          title: this.article.title,
          intro: this.article.intro,
          author: this.article.author,
          content: this.article.content,
          imageUrl: this.article.imageUrl
        }).then(res => {
          if (res.data.success) {
            alert('添加成功')
          } else {
            alert('添加失败请重试！')
          }
        })
      }
    }
  }
</script>
