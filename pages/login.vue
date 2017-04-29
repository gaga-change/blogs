<template>
  <div class="container">
    <form class="form-signin" ref="formSignin">
      <h2 class="form-signin-heading">登入</h2>
      <label for="inputEmail01" class="sr-only">Email address</label>
      <input type="text" name="email" id="inputEmail01" class="form-control" placeholder="Email address" required
             autofocus>
      <label for="inputPassword01" class="sr-only">Password</label>
      <input type="password" name="password" id="inputPassword01" class="form-control" placeholder="Password" required>
      <div class="checkbox">
        <label>
          <input type="checkbox" value="remember-me"> Remember me
        </label>
      </div>
      <button class="btn btn-lg btn-primary btn-block" type="submit" @click="signin($event, $refs.formSignin)">登入
      </button>
    </form>
    <form class="form-signin" ref="formSignup">
      <h2 class="form-signin-heading">注册</h2>
      <label for="inputEmail" class="sr-only">Email address</label>
      <input value="123@11.com" type="email" id="inputEmail" name="email" class="form-control"
             placeholder="Email address" required
             autofocus>
      <label for="inputName" class="sr-only">Full Name</label>
      <input value="123" type="text" id="inputName" name="name" class="form-control" placeholder="Full Name" required
             autofocus>
      <label for="inputUsername" class="sr-only">username</label>
      <input value="123" type="text" id="inputUsername" name="username" class="form-control" placeholder="Username"
             required>
      <label for="inputPassword" class="sr-only">Password</label>
      <input value="123" type="password" id="inputPassword" name="password" class="form-control" placeholder="Password"
             required>
      <div class="checkbox">
        <label>
          <input type="checkbox" value="remember-me"> Remember me
        </label>
      </div>
      <button class="btn btn-lg btn-primary btn-block" type="submit" @click="signup($event,$refs.formSignup)">注册
      </button>
    </form>
    <button @click="getUser">获取账号信息</button>
    <button @click="logout">退出</button>
  </div> <!-- /container -->
</template>

<script>
  import axios from '~plugins/axios'
  export default {
    methods: {
      signin(event, form){
        event.preventDefault()
        let body = {
          email: form.email.value,
          password: form.password.value
        }
        axios.post('/api/users/session', body).then(res => {
          res = res.data;
          if (res.success) {
            console.log(res)
          } else {
            console.log(res);
          }
        })
      },
      getUser(){
        axios.get('/api/users').then(res => {
          console.log(res.data)
        })
      },
      logout(){
        axios.get('/api/logout').then(res => {
          console.log(res.data)
        })
      },
      signup(event, form) {
        event.preventDefault()
        let body = {
          email: form.email.value,
          name: form.name.value,
          username: form.username.value,
          password: form.password.value
        }
        axios.post('/api/users', body).then(res => {
          res = res.data
          if (res.success) {
            alert('success')
//            this.$router.push({ path: '/'})
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