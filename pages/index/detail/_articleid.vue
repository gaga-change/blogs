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
    <!--回复框-->
    <div id="reply" class="clearfix"
         style="padding-bottom: 20px; margin-bottom: 20px; border-bottom: 1px solid gainsboro;">
      <div class="col-xs-8">
        <textarea class="ipt-txt " cols="80" name="msg" rows="5"
                  v-model="comment"
                  placeholder="请自觉遵守互联网相关的政策法规，严禁发布色情、暴力、反动的言论。"></textarea>
      </div>
      <div class="col-xs-4">
        <button type="button" class="comment-submit" @click="addComment">
          {{sendComment ? '正在发送' : '发表评论'}}
        </button>
      </div>
    </div>
    <!--评论区-->
    <div>
      <ul class="media-list">
        <li class="media" v-for="item in mdComments" style="border-bottom: 1px solid gainsboro;">
          <div class="media-left"></div>
          <div class="media-body">
            <p class="user" v-text="item.user.name"></p>
            <p class="con" v-html="item.body"></p>
            <div class="info">
              <span class="time">{{item.createDate | prettyTime03}}</span>
              <span class="reply btn-hover" @click="replyClick(item)">回复</span>
              <span class="reply btn-hover" @click="delComment(item)"
                    v-if="user && (user._id === item.user._id || user.isMaster)">删除</span>
            </div>
            <ul class="media-list">
              <li class="media" v-for="itemSon in item.comments" style="margin-top: 10px">
                <div class="media-left" style="width: 8%"></div>
                <div class="media-body" style="border-top: 1px solid gainsboro; padding-top: 10px">
                  <p class="user" v-text="itemSon.user.name"></p>
                  <p class="con" v-html="itemSon.body"></p>
                  <div class="info">
                    <span class="time">{{itemSon.createDate | prettyTime03}}</span>
                    <span class="reply btn-hover" @click="replyClick(item, itemSon.user.name)">回复</span>
                    <span class="reply btn-hover" @click="delSonComment(item,itemSon)"
                          v-if="user && (user._id === itemSon.user._id || user.isMaster)">删除</span>
                  </div>
                </div>
              </li>
            </ul>
            <div style="margin-bottom: 10px"></div>
            <div v-if="item.reply" class="clearfix">
              <div class="col-xs-8">
        <textarea class="ipt-txt " cols="80" name="msg" rows="5"
                  v-model="item.comment"
                  placeholder="请自觉遵守互联网相关的政策法规，严禁发布色情、暴力、反动的言论。"></textarea>
              </div>
              <div class="col-xs-4">
                <button type="button" class="comment-submit" @click="addSonComment(item)">
                  {{item.sendComment ? '正在发送' : '发表回复'}}
                </button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <nav aria-label="Page navigation ">
      <ul class="pagination">
        <li><a> 总：<span v-text="count"></span>条</a></li>
        <li v-if="page > 3 && pages > 5">
          <a href="javescript:void(0)" @click="getList(1)">
            <span><<</span>
          </a>
        </li>
        <li v-if="page > 1">
          <a href="javascript:void(0)" @click="getList(page - 1)">
            <span><</span>
          </a>
        </li>
        <li v-for="item in myPages" :class="{'active': item === page }">
          <a href="javascript:void(0)" @click="getList(item)">{{item}}</a>
        </li>
        <li v-if="page < pages">
          <a href="javascript:void(0)" @click="getList(page + 1)">
            <span>></span>
          </a>
        </li>
        <li v-if="page < pages - 2 && pages > 5">
          <a href="javascript:void(0)" @click="getList(pages)">
            <span>>></span>
          </a>
        </li>
      </ul>
    </nav>
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
  import $ from 'jquery'
  import Vue from 'vue'
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
            article: article,
            comments: [],
            comment: '',
            sendComment: false,
            limit: 5,
            count: 0,
            page: 1,
            pages: 1
          }
        } else {
          console.error("文章详情请求错误：", res)
        }
      }).catch((e) => {
        error({statusCode: 404, message: 'Article not found'})
      })
    },
    created() {
      this.getList(1, false)
    },
    computed: {
      query(){return this.$route.query},
      params(){return this.$route.params},
      mdComments() {
        var md = Vue.filter('md')
        this.comments.forEach(v => {
          v.body = md(v.body)
//          v.reply = false
          Vue.set(v, 'reply', false)
          Vue.set(v, 'sendComment', false)
          Vue.set(v, 'comment', '')
          v.comments.forEach(w => {
            w.body = md(w.body)
          })
        })
        return this.comments
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
      },
      user () {return this.$store.state.user}
    },
    methods: {
      /*删除主评论*/
      delComment (item) {
        if (confirm('删除后无法恢复，是否继续删除'))
          axios.delete('/api/comment/' + item._id).then(res => {
            if (res.data.success) {
              this.getList(this.page, false)
            } else {
              console.log('删除错误 主评论', res.data)
            }
          })
      },
      /*删除次评论*/
      delSonComment (item, itemSon) {
        if (confirm('删除后无法恢复，是否继续删除'))
          axios.delete('/api/son/comment/' + item._id + '/' + itemSon._id).then(res => {
            if (res.data.success) {
              this.getList(this.page, false)
            } else {
              console.log('删除错误 次评论', res.data)
            }
          })
      },
      /*添加评论*/
      addComment () {
        if (!this.user) {
          this.$router.push({name: 'index-login', query: {'retpath': this.$route.fullPath}})
          return
        }
        if (this.comment === '') {
          alert('内容不能为空')
          return
        }
        this.sendComment = true
        axios.post('/api/comment/' + this.article._id, {body: this.comment}).then(
          res => {
            this.sendComment = false
            this.comment = ''
            if (this.page === 1) this.getList(this.page, false)
          },
          () => {
            console.log("评论提交错误")
          }
        )
      },
      /*子评论添加*/
      addSonComment (item) {
        if (!this.user) {
          this.$router.push({name: 'index-login', query: {'retpath': this.$route.fullPath}})
          return
        }
        if (item.comment === '') {
          alert('内容不能为空')
          return
        }
        item.sendComment = true
        axios.post('/api/son/comment/' + item._id, {body: item.comment}).then(
          res => {
            item.sendComment = false
            item.comment = ''
            this.getList(this.page, false)
          },
          () => {
            console.log("评论提交错误")
          }
        )
      },
      /*获取评论列表*/
      getList(page, goTop = true) {
        axios.get('/api/comment', {
          params: {
            articleId: this.article._id,
            limit: this.limit,
            page: page,
          }
        }).then(res => {
          if (goTop) {
            scrollTo(0, $('#reply').offset().top - 20)
          }
          if (res.data.success) {
            this.comments = res.data.data
            this.pages = res.data.pages
            this.page = page
            this.count = res.data.count
          }
        })
      },
      /*点击回复*/
      replyClick(item, str) {
        item.comment = ''
        if (str) {
          item.comment = '回复 @ ' + str + ':'
        }
        this.mdComments.forEach(v => {
          v.reply = false
        })
        item.reply = true;
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  div {
    font-family: Microsoft YaHei, Arial, Helvetica, sans-serif;
  }

  .btn-hover {
    padding: 0 5px;
    border-radius: 4px;
    margin-right: 15px;
    cursor: pointer;
    display: inline-block;
    &:hover {
      color: #00a1d6;
      background: #e5e9ef;
    }
  }

  .media {
    .info {
      color: #99a2aa;
      line-height: 26px;
      font-size: 12px;
      & > span {
        margin-right: 20px;
      }
    }
    p {
      margin: 0
    }
    p.user {
      color: #6d757a;
      font-size: 12px;
      font-weight: 700;
      line-height: 18px;
      padding-bottom: 4px;
      display: block;
      word-wrap: break-word;
    }
    p.con {
      line-height: 20px;
      padding: 2px 0;
      font-size: 14px;
      text-shadow: none;
      overflow: hidden;
      word-wrap: break-word;
    }
  }

  .comment-submit {
    width: 70px;
    height: 64px;
    top: 0;
    padding: 4px 15px;
    font-size: 14px;
    color: #fff;
    border-radius: 4px;
    text-align: center;
    min-width: 60px;
    vertical-align: top;
    cursor: pointer;
    background-color: #00a1d6;
    border: 1px solid #00a1d6;
    transition: .1s;
    user-select: none;
    outline: none;
    &:hover {
      background-color: #00b5e5;
      border-color: #00b5e5;
    }
  }

  .ipt-txt {
    font-size: 12px;
    display: inline-block;
    box-sizing: border-box;
    background-color: #f4f5f7;
    border: 1px solid #e5e9ef;
    overflow: auto;
    border-radius: 4px;
    color: #555;
    width: 100% !important;
    height: 65px;
    transition: 0s;
    padding: 5px 10px;
    line-height: normal;
    outline: none;
    resize: none;
    &:hover, &:focus {
      background-color: #fff;
      border-color: #00a1d6;
    }
  }

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