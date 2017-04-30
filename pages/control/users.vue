<template>
  <div>
    <h2 class="sub-header">
      网站用户
      <button class="btn btn-info" type="button" @click="btnSearch">查询</button>
    </h2>
    <div>
      邮箱：<input type="text" placeholder="邮箱" v-model="searchEmail">
      用户名：<input type="text" placeholder="用户名" v-model="searchName">
    </div>
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
        <tr>
          <th>index</th>
          <th>name</th>
          <th>email</th>
          <th>password</th>
          <th>createDate</th>
          <th>updateDate</th>
          <th>isMaster</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,index) in users">
          <td v-text="index + 1"></td>
          <td>
            <span v-if="!item.modify" v-text="item.name"></span>
            <input v-if="item.modify" type="text" v-model="newName">
          </td>
          <td>
            <span v-if="!item.modify" v-text="item.email"></span>
            <input v-if="item.modify" type="text" v-model="newEmail">
          </td>
          <th>
            <span v-if="!item.modify">******</span>
            <input v-if="item.modify" type="text" v-model="newPassword">
          </th>
          <td> {{ item.createDate | prettyTime}}</td>
          <td> {{ item.updateDate | prettyTime}}</td>
          <td v-text="item.permissions === 1"></td>
          <td>
            <button v-if="item.permissions === 2" @click="goDel(item)">删除</button>
            <button @click="modifyUsers(item)">{{!item.modify ? '修改' : '提交'}}</button>
          </td>
        </tr>
        <tr>
          <td></td>
          <td><input ref="inputName" type="text"></td>
          <td><input ref="inputEmail" type="text"></td>
          <td><input ref="inputPassword" type="password"></td>
          <td></td>
          <td></td>
          <td></td>
          <td>
            <button @click="addUsers">添加</button>
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
  export default {
    asyncData ({params, error}) {
      return axios.get('/api/users', {
        params: {
          limit: 10,
          page: 1
        }
      }).then((res) => {
        return {
          users: res.data.data,
          showModal: false,
          modalContent: '',
          checkItem: null,
          count: res.data.count,
          limit: 10,
          page: 1,
          pages: res.data.pages,
          newName: '',
          newEmail: '',
          newPassword: '',
          searchName: '',
          searchEmail: ''
        }
      }).catch((e) => {
        error({statusCode: 404, message: 'User not found'})
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
      // 修改新类型
      modifyUsers (item) {
        // 如果已近进入修改模式
        if (item.modify) {
          item.modify = false
          axios.put('/api/users/' + item._id, {
            name: this.newName,
            email: this.newEmail,
            password: this.newPassword.trim() === '' ? null : this.newPassword
          }).then(res => {
            if (!res) return
            if (!res.data.success) {
              alert(res.data.errors)
            } else {
              item.name = this.newName
              item.email = this.newEmail
              item.updateDate = Date.now()
            }
          })
        } else {
          this.users.map(v => {
            this.$set(v, 'modify', false)
          })
          this.$set(item, 'modify', true)
          this.newName = item.name
          this.newEmail = item.email
          this.newPassword = ''
        }
      },
      // 添加新类型
      addUsers () {
        axios.post('/api/users/add', {
          name: this.$refs.inputName.value,
          email: this.$refs.inputEmail.value,
          password: this.$refs.inputPassword.value
        }).then(res => {
          if (!res) return
          if (!res.data.success) {
            alert(res.data.errors[0])
          } else {
            alert('添加成功')
//            this.users.push(res.data.user)
            this.$refs.inputName.value = ''
            this.$refs.inputEmail.value = ''
            this.$refs.inputPassword.value = ''
          }
        })
      },
      // 点击删除，显示提示框
      goDel (item) {
        this.checkItem = item
        this.showModal = true
        this.modalContent = '用户名:  ' + item.name + ' 邮箱:  ' + item.email
      },
      // 提示框点击确认后，然后删除数据
      confirmDel () {
        axios.delete('/api/users/' + this.checkItem._id).then(res => {
          if (!res) return
          res = res.data
          if (res.success) {
            this.users = this.users.filter(v => {
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
        axios.get('/api/users', {
          params: {
            limit: this.limit,
            page: page,
            email: this.searchEmail,
            name: this.searchName
          }
        }).then(res => {
          this.users = res.data.data
          this.pages = res.data.pages
          this.page = page
          this.count = res.data.count
        })
      }
    },
    components: {
      Modal
    },
    head () {
      return {
        title: `控制中心-文章类型`
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