<template>
  <div>
    gaga_change {{query.name}}
    <!--{{$route.params.menu}}-->
  </div>
</template>

<script>
  import axios from '~plugins/axios'
  export default {
    computed: {
      query(){
        return this.$route.query
      }
    },
    asyncData ({params, error}) {
      return axios.get('/api/article/class', {
        params: {
          articleMenuId: '5900431536a4b61dd80f9b11'
        }
      }).then(res => {

      })
    },
    watch: {
      query(){
        this.$store.commit('SET_MENU_NAME', this.query.name || '')
      }
    },
    created() {
      this.$store.commit('SET_MENU_NAME', this.query.name || '')
    }
  }
</script>

<style>

</style> 