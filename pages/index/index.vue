<template>
  <div>
    <div class="media" v-for="item in articles">
      <h4 v-text="item.title"></h4>
      <div class="media-left media-middle">
        <a href="#">
          <img class="media-object" :src="item.imageUrl">
        </a>
      </div>
      <div class="media-body">
        <p v-text="item.intro"></p>
        <a class="btn" href="#">阅读全文</a>
      </div>
      <p class="dateview">
        <span>{{item.createDate | prettyTime02}}</span>
        <span>作者：<span v-text="item.author"></span></span>
        <span>个人博客：[<a href="#">{{item.articleClass.name}}</a>]</span>
      </p>
    </div>
  </div>
</template>

<script>
  import axios from '~plugins/axios'
  export default {
    asyncData ({params, error}) {
      return axios.get('/api/article', {
        params: {push: true}
      })
      .then((res) => {
        return {
          articles: res.data.articles
        }
      })
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .media {
     &:first-child h4{
      color: #f00;
      background: url(/images/new.gif) no-repeat 330px;
      display: block;
    }
    h4 {
      font-weight: 500;
    }
    p {
      color: #756F71;
    }
    // 立即阅读
    .btn {
      background: #fd8a61;
      color: #fff;
      padding: 5px 10px;
      float: right;
      margin: 20px 20px;
    }
    // 底部详情
    .dateview {
      width: 100%;
      overflow: hidden;
      clear: both;
      margin: 10px 0 0 0;
      display: inline-block;
      background: #f6f6f6 url(/images/time.jpg) 15px center no-repeat;
      line-height: 26px;
      height: 26px;
      color: #838383;
      padding-left: 16px;
      & > span {
        margin: auto 20px;
      }
    }
  }
</style> 