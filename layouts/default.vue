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
import Header from '~components/Head.vue'

export default {
  components: {
    MyFooter,
    'vue-head': Header
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
  @import "../assets/css/_bootstrap.scss";
</style>