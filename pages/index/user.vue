<template>
  <div class="container">
    <h2>个人信息</h2>
    <ul>
      <li v-if="user"><span>用户名：</span> <span v-text="user.name"></span></li>
      <li v-if="user"><span>邮箱：</span> <span v-text="user.email"></span></li>
    </ul>
  </div>
</template>
<script>
  export default {
    layout: 'blog',
    methods: {},
    middleware: 'authenticated',
    computed: {
      user () {
        return this.$store.state.user
      }
    },
    watch: {
      user (value) {
        if (!value) {
          this.$router.replace('/login')
        }
      }
    },
    created() {
      this.$store.commit('SET_MENU_NAME', '个人信息')
    }
  }
</script>
