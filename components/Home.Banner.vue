<template>
  <div class="banner" v-if="show">
    <!--<img src="/public/banner.jpg" alt="banner">-->
  </div>
</template>

<script>
  export default {
    props: ['show']
  }
</script>

<style scoped>
  .banner {
    height: 265px;
    background: url("/img/banner.jpg") transparent center top;
    position: relative;
  }
</style>