<template>
  <div>
    碎言碎语列表
  </div>
</template>

<script>
  export default {
    created() {
      this.$store.commit('SET_MENU_NAME', '碎言碎语')
    }
  }
</script>

<style>

</style> 