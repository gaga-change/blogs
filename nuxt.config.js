module.exports = {
  router: {
    middleware: 'check-auth',
    // scrollBehavior: function (to, from, savedPosition) {
    //   // savedPosition 只有在 popstate 导航（如按浏览器的返回按钮）时可以获取。
    //   if (savedPosition) {
    //     return savedPosition
    //   } else {
    //     let position = {x: 0, y: 0}
    //     // 如果目标页面的url有锚点,  则滚动至锚点所在的位置
    //     if (to.hash) {
    //       position = {selector: to.hash}
    //     }
    //     return position
    //   }
    // }
  },
  plugins: ['~plugins/vue-plugins'],
  /*
   ** Headers of the page
   */
  head: {
    htmlAttrs: {
      lang: 'zh'
    },
    title: 'starter',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: 'Nuxt.js project'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
    ],
    script: [
      {src: '/js/jquery.min.js'},
      {src: '/js/bootstrap.min.js'},
    ]
  },
  /*
   ** Global CSS
   */
  css: ['~assets/css/main.css'],
  /*
   ** Add axios globally
   */
  build: {
    vendor: ['axios']
  }
}
