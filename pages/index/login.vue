<template>
  <div>
    <form class="form-signin" ref="formSignin">
      <h2 class="form-signin-heading">登入</h2>
      <label for="inputEmail01" class="sr-only">Email address</label>
      <input type="text" name="email" id="inputEmail01" class="form-control" placeholder="邮箱" required
             autofocus>
      <label for="inputPassword01" class="sr-only">Password</label>
      <input type="password" name="password" id="inputPassword01" class="form-control" placeholder="密码" required>
      <button class="btn btn-lg btn-primary btn-block" type="submit" @click="signin($event, $refs.formSignin)">登入
      </button>
    </form>
  </div> <!-- /container -->
</template>

<script>
  import axios from '~plugins/axios'
  export default {
    layout: 'blog',
    created() {
      this.$store.commit('SET_MENU_NAME', '登入')
    },
    methods: {
      signin (event, form) {
        event.preventDefault()
        let body = {
          email: form.email.value,
          password: form.password.value
        }
        axios.post('/api/users/session', body).then(res => {
          res = res.data
          if (res.success) {
            console.log(res)
            this.$store.commit('SET_USER', res.user)
            localStorage.setItem('user', JSON.stringify(res.user))
            this.$router.replace({path: '/'})
          } else {
            console.log(res)
          }
        })
      }
    }
  }
</script>

<style scoped>
  .form-signin {
    max-width: 330px;
    padding: 15px;
    margin: 0 auto;
  }

  .form-signin .form-signin-heading,
  .form-signin .checkbox {
    margin-bottom: 10px;
  }

  .form-signin .checkbox {
    font-weight: normal;
  }

  .form-signin .form-control {
    position: relative;
    height: auto;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 10px;
    font-size: 16px;
  }

  .form-signin .form-control:focus {
    z-index: 2;
  }

  .form-signin input[type="email"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  .form-signin input[type="password"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

</style> 