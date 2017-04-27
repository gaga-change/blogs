<template>
  <div class="container">
    <header class="row">
      <h4 class="pull-left">
        文章<span class="text-primary">推荐</span>
      </h4>
    </header>
    <div class="row">
      <!--左侧 文章推荐-->
      <section class="col-md-9" style="height: 500px; background-color: #00b3ee" >
      </section>
      <!--右侧最新文章列表&友情链接-->
      <aside class="col-md-3" style="height: 500px; background-color: #ee63bd" >
      </aside>
    </div>
  </div>
</template>
<script>
  export default {}
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