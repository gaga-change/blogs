<template>
  <div class="container">
    <h2>个人信息</h2>
    <ul>
      <li><span>用户名：</span> <span v-text="user.name"></span></li>
      <li><span>邮箱：</span> <span v-text="user.email"></span></li>
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
    }
  }
</script>
