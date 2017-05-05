<template>
  <div>
    <vue-head/>
    <vue-banner></vue-banner>
    <!--<vue-container></vue-container>-->
    结构区
    <nuxt></nuxt>
  </div>
</template>

<script>
  import Banner from '~components/Home.Banner.vue'
  import Container from '~components/Home.Container.vue'
  export default {
    components: {
      'vue-banner': Banner,
      'vue-container': Container
    }
  }
</script>

<style >

</style>