<template>
  <div>
    <!--[if lt IE 9]>
    <!--<![endif]&ndash;&gt;-->
    <nuxt/>
    <my-footer/>
  </div>
</template>

<script>
  import MyFooter from '~components/Footer.vue'

  export default {
    components: {
      MyFooter
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  @import "../assets/css/_bootstrap.scss";
</style>