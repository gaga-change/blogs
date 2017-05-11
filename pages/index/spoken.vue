<template>
  <div>
    <div>
      <ul class="bloglist">
        <li v-for="item in spokens" class="arrow_box">
          <div class="sy">
            <p class="clearfix text-muted">
              <img v-if="item.imageUrl" :src="item.imageUrl">
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
          <nuxt-link :to="{name:'index-spoken', query: {page: '1'}}">
            <span><<</span>
          </nuxt-link>
        </li>
        <li v-if="page > 1">
          <nuxt-link :to="{name:'index-spoken', query: {page: page -1}}">
            <span><</span>
          </nuxt-link>
        </li>
        <li v-for="item in myPages" :class="{'active': item === page }">
          <nuxt-link :to="{name:'index-spoken', query: {page: item}}">
            {{item}}
          </nuxt-link>
        </li>
        <li v-if="page < pages">
          <nuxt-link :to="{name:'index-spoken', query: {page: page + 1}}">
            <span>></span>
          </nuxt-link>
        </li>
        <li v-if="page < pages - 2 && pages > 5">
          <nuxt-link :to="{name:'index-spoken', query: {page: pages}}">
            <span>>></span>
          </nuxt-link>
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
    asyncData ({params, error, query}) {
      const page = Number(query.page) || 1
      return axios.get('/api/spoken', {
        params: {
          limit: 10,
          page: page
        }
      }).then((res) => {
        return {
          spokens: res.data.data,
          count: res.data.count,
          limit: 10,
          page: page,
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