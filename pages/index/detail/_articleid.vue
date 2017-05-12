<template>
  <div>
    <div class="index_about">
      <h2 class="text-center" v-text="article.title"></h2>
      <p class="box_c small">
        <span class="d_time">发布时间：<span>{{article.createDate | prettyTime02}}</span></span>
        <span>编辑：<span v-text="article.author"></span></span>
        <span>阅读（<span v-text="article.clickNum"></span>）</span>
      </p>
      <div v-html="article.content"></div>
    </div>
  </div>
</template>

<script>
  /**
   *
   * 博客id
   *   - 类型id 类型名
   *   - 类别id 类别名
   * 数据获取 通过id拿到详情
   * 相关通过store传入到 index，生成一个当前位置
   */
  import axios from '~plugins/axios'
  const MarkdownIt = require('markdown-it')
  const md = new MarkdownIt();
  export default {
    asyncData ({params, error, store, query}) {
      return axios.get('/api/article', {
        params: {item: params.articleid}
      }).then(res => {
        if (res.data.success) {
          store.commit('SET_MENU_NAME', res.data.articles[0].articleClass.name || '')
          store.commit('setArticle', res.data.articles[0] || '')
          let article = res.data.articles[0]
          article.content = md.render(article.content)
          return {
            article: article
          }
        } else {
          console.error("文章详情请求错误：", res)
        }
      }).catch((e) => {
        error({statusCode: 404, message: 'Article not found'})
      })
    },
    created() {
    },
    computed: {
      query(){return this.$route.query},
      params(){return this.$route.params}
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .index_about {
    margin-top: 40px;
    margin-bottom: 40px;
    padding-bottom: 40px;
    border-bottom: 1px rgba(183, 183, 183, 0.49) groove;
    p.box_c {
      border: #ccc 1px dashed;
      text-align: center;
      padding: 5px 0;
      margin-right: 30px;
      color: #999;
      & > span {
        margin: auto 10px;
      }
    }
  }
</style> 