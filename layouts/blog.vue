<template>
    <div>
        <vue-head></vue-head>
        <nuxt></nuxt>
    </div>
</template>
<script>
  import Header from '~components/Head.vue'
  export default {
    components: {
      'vue-head': Header
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
    @import "../assets/css/_bootstrap.scss";
</style>