<template>
  <div>
    <vue-head/>
    <vue-banner></vue-banner>
    <vue-container></vue-container>
  </div>
</template>

<script>
  import Banner from '~components/Home.Banner.vue'
  import Container from '~components/Home.Container.vue'
  import Head from '~components/Head.vue'
  export default {
    components: {
      'vue-banner': Banner,
      'vue-container': Container,
      'vue-head': Head
    }
  }
</script>

<style>

</style>