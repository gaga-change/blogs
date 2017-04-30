<template>
  <div>
    <h2 class="sub-header">文章类别</h2>
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
        <tr>
          <th>index</th>
          <th>class</th>
          <th>type</th>
          <th>createDate</th>
          <th>updateDate</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,index) in articleClasses">
          <td v-text="index + 1"></td>
          <td>
            <span v-if="!item.modify" v-text="item.name"></span>
            <input v-if="item.modify" type="text" v-model="newName">
          </td>
          <td>
            <span v-if="!item.modify" >
              {{(item.articleMenu ? item.articleMenu.name : '' ) }}
            </span>
            <select v-if="item.modify" class="form-control" v-model="newTypeId">
              <option v-for="opt in articleMenus" :value="opt._id"
                      :selected="opt.name == (item.articleMenu ? item.articleMenu.name : '') ? 'selected' : ''"
              >{{opt.name}}
              </option>
            </select>
          </td>
          <td v-text="new Date(item.createDate).toLocaleString()"></td>
          <td v-text="new Date(item.updateDate).toLocaleString()"></td>
          <td>
            <button @click="goDel(item)">删除</button>
            <button @click="modifyArticleClass(item)">{{!item.modify ? '修改' : '提交'}}</button>
          </td>
        </tr>
        <tr>
          <td></td>
          <td><input ref="inputAdd" type="text"></td>
          <td>
            <select class="form-control" ref="selectAdd">
              <option v-for="opt in articleMenus" :value="opt._id"
              >{{opt.name}}
              </option>
            </select>
          </td>
          <td></td>
          <td></td>
          <td>
            <button @click="addArticleClass($refs.inputAdd ,$refs.selectAdd)">添加</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
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
    name: 'ArticleClass',
    asyncData ({params, error}) {
      return axios.get('/api/article/class')
      .then((res) => {
        return {
          articleMenus: null,
          articleClasses: res.data.data,
          showModal: false,
          modalContent: '',
          checkItem: null,
          newName: '',
          newTypeId: ''
        }
      })
      .catch((e) => {
        error({statusCode: 404, message: 'ArticleClass not found'})
      })
    },
    created(){
      // 获取 文章所有文章类型
      axios.get('/api/article/menu').then(res => {
        if (res.data.success) {
          this.articleMenus = res.data.data
        }
      })
    },
    methods: {
      // 修改新类型
      modifyArticleClass (item) {
        // 如果已近进入修改模式
        if (item.modify) {
          item.modify = false
          axios.put('/api/article/class/' + this.newTypeId + '/' + item._id, {
            name: this.newName
          }).then(res => {
            if (!res.data.success) {
              alert('更新异常，请重试！')
            } else {
              axios.get('/api/article/class/' + item._id).then(res => {
                item.articleMenu = res.data.data.articleMenu
              })
              item.name = this.newName
              item.updateDate = Date.now()
            }
          })
          item.modify = false
        } else {
          this.articleClasses.map(value => {
            this.$set(value, 'modify', false)
          })
          item.modify = true
          this.newName = item.name
          this.newTypeId = item.articleMenu ? item.articleMenu._id : this.articleMenus[0]._id
        }
      },
      // 添加新类型
      addArticleClass (input, select) {
        axios.post('/api/article/class/' + select.value, {name: input.value}).then(res => {
          if (!res.data.success) {
            alert('改类型已存在！')
          } else {
            axios.get('/api/article/class')
            .then((res) => {
              this.articleClasses = res.data.data
            })
            input.value = ''
          }
        })
      },
      // 点击删除，显示提示框
      goDel (item) {
        this.checkItem = item;
        this.showModal = true
        this.modalContent = '文章类别名:  ' + item.name
      },
      // 提示框点击确认后，然后删除数据
      confirmDel () {
        axios.delete('/api/article/class/' + this.checkItem._id).then(res => {
          res = res.data
          if (res.success) {
            this.articleClasses = this.articleClasses.filter(v => {
              return v._id !== this.checkItem._id
            })
          } else {
            alert("删除失败，请重试！")
          }
        })
      }
    },
    components: {
      Modal
    },
    head () {
      return {
        title: `控制中心-文章类别`
      }
    }
  }
</script>

<style>

</style> 