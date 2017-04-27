<template>
  <div>
    <h2 class="sub-header">文章类型</h2>
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
        <tr>
          <th>index</th>
          <th>name</th>
          <th>createDate</th>
          <th>updateDate</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,index) in articleMenus">
          <td v-text="index + 1"></td>
          <td>
            <span v-if="!item.modify" v-text="item.name"></span>
            <input v-if="item.modify" type="text" v-model="newName">
          </td>
          <td v-text="new Date(item.createDate).toLocaleString()"></td>
          <td v-text="new Date(item.updateDate).toLocaleString()"></td>
          <td>
            <button @click="goDel(item)">删除</button>
            <button @click="modifyArticleMenu(item)">{{!item.modify? '修改':'提交'}}</button>
          </td>
        </tr>
        <tr>
          <td></td>
          <td><input ref="inputName" type="text"></td>
          <td></td>
          <td></td>
          <td>
            <button @click="addArticleMenus">添加</button>
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
    name: 'collection',
    asyncData ({params, error}) {
      return axios.get('/api/article/menu')
      .then((res) => {
        return {
          articleMenus: res.data.data,
          showModal: false,
          modalContent: '',
          checkItem: null,
          newName: ''
        }
      })
      .catch((e) => {
        error({statusCode: 404, message: 'ArticleMenu not found'})
      })
    },
    methods: {
      //修改新类型
      modifyArticleMenu (item) {
        // 如果已近进入修改模式
        if (item.modify) {
          item.modify = false
          axios.put('/api/article/menu/' + item._id, {
            name: this.newName
          }).then(res => {
            if (!res.data.success) {
              alert(this.newName + ' 类型名已存在！')
            } else {
              item.name = this.newName
              item.updateDate = Date.now()
            }
          })
        } else {
          this.$set(item, 'modify', true)
          this.newName = item.name
        }
      },
      // 添加新类型
      addArticleMenus () {
        axios.post('/api/article/menu', {name: this.$refs.inputName.value}).then(res => {
          if (!res.data.success) {
            alert('改类型已存在！')
          } else {
            axios.get('/api/article/menu')
            .then((res) => {
              this.articleMenus = res.data.data
            })
            this.$refs.inputName.value = ''
          }
        })
      },
      // 点击删除，显示提示框
      goDel (item) {
        this.checkItem = item;
        this.showModal = true
        this.modalContent = '文章类型名:  ' + item.name
      },
      // 提示框点击确认后，然后删除数据
      confirmDel () {
        axios.delete('/api/article/menu/' + this.checkItem._id).then(res => {
          res = res.data
          if (res.success) {
            this.articleMenus = this.articleMenus.filter(v => {
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
        title: `控制中心-文章类型`
      }
    }
  }
</script>

<style>

</style> 