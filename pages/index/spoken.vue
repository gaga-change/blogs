<template>
  <div>
    <div>
      <ul class="bloglist">
<!--        <li class="arrow_box">
          <div class="sy">
            <p class="clearfix text-muted">
              <img src="http://images.yanjundong.top/blog_02.jpg?imageView2/1/w/185/h/118/format/jpg/q/86"
                   alt="生活的坑都是自己挖的"/>
              生活的坑都是自己挖的！譬如，听别人讲话，听到最后，耳朵里只会记住两类话：最愿意听的和最不愿意听的。然后，喜欢听的未必化成快乐，但不喜欢听的一定化成了痛苦，其他的都化成了风。
            </p>
          </div>
          <span class="dateview">2015-02-01</span>
        </li>-->
        <li v-for="item in spokens" class="arrow_box">
          <div class="sy">
            <p class="clearfix text-muted">
              <img v-if="item.imageUrl" :src="item.imageUrl">
              <!--<img src="http://images.yanjundong.top/blog_02.jpg?imageView2/1/w/185/h/118/format/jpg/q/86"-->
                   <!--alt="生活的坑都是自己挖的"/>-->
              <span v-text="item.intro"></span>
            </p>
          </div>
          <span class="dateview">{{item.createDate | prettyTime02}}</span>
        </li>
      </ul>
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
          <a href="javescript:void(0)" @click="getUserList(page - 1)">
            <span><</span>
          </a>
        </li>
        <li v-for="item in myPages" :class="{'active': item === page }">
          <a href="javescript:void(0)" @click="getUserList(item)">{{item}}</a>
        </li>
        <li v-if="page < pages">
          <a href="javescript:void(0)" @click="getUserList(page + 1)">
            <span>></span>
          </a>
        </li>
        <li v-if="page < pages - 2 && pages > 5">
          <a href="javescript:void(0)" @click="getUserList(pages)">
            <span>>></span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
  import axios from '~plugins/axios'
  export default {
    created() {
      this.$store.commit('SET_MENU_NAME', '碎言碎语')
    },
    asyncData ({params, error}) {
      return axios.get('/api/spoken', {
        params: {
          limit: 10,
          page: 1
        }
      }).then((res) => {
        return {
          spokens: res.data.data,
          count: res.data.count,
          limit: 10,
          page: 1,
          pages: res.data.pages,
        }
      })
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
      }
    },
    methods: {
      // 根据页码获取 列表
      getUserList (page) {
        axios.get('/api/spoken', {
          params: {
            limit: this.limit,
            page: page,
            intro: this.searchIntro
          }
        }).then(res => {
          this.spokens = res.data.data
          this.pages = res.data.pages
          this.page = page
          this.count = res.data.count
        })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  ul {
    padding: 0;
    list-style: none;
  }

  .bloglist {
    width: 100%;
    margin: 0 auto;
  }

  .arrow_box {
    background: #f8f8f8;
    box-shadow: 0px 1px 0px rgba(255, 255, 255, .1), inset 0px 1px 1px rgba(214, 214, 214, 0.7);
    width: 100%;
    border-radius: 6px;
    position: relative;
    padding: 20px;
    margin: 20px 0;
    .dateview {
      position: absolute;
      right: 10px;
      bottom: 10px;
    }
    img {
      float: left;
      margin-right: 10px;
    }
  }
</style> 