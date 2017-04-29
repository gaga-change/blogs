<template>
  <div class="container">
    <form class="form-signin" ref="formSignup">
      <h2 class="form-signin-heading">注册</h2>
      <label for="inputEmail" class="sr-only">Email address</label>
      <input type="email" id="inputEmail" name="email" class="form-control"
             placeholder="Email address" required
             autofocus>
      <label for="inputName" class="sr-only">Full Name</label>
      <input type="text" id="inputName" name="name" class="form-control" placeholder="Full Name" required
             autofocus>
      <label for="inputPassword" class="sr-only">Password</label>
      <input type="password" id="inputPassword" name="password" class="form-control" placeholder="Password"
             required>
      <button class="btn btn-lg btn-primary btn-block" type="submit" @click="signup($event,$refs.formSignup)">注册
      </button>
    </form>
  </div> <!-- /container -->
</template>

<script>
  import axios from '~plugins/axios'
  export default {
    layout: 'blog',
    methods: {
      signup (event, form) {
        event.preventDefault()
        let body = {
          email: form.email.value,
          name: form.name.value,
          password: form.password.value
        }
        axios.post('/api/users', body).then(res => {
          res = res.data
          if (res.success) {
            this.$store.commit('SET_USER', res.user)
            sessionStorage.setItem('user', JSON.stringify(res.user))
            this.$router.replace({path: '/'})
          } else {
            alert(res.errors)
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