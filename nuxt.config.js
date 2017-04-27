module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    htmlAttrs: {
      lang: 'zh'
    },
    title: 'starter',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {rel: 'stylesheet', href: '/css/bootstrap.css'},
      {rel: 'stylesheet', href: '/css/ie10-viewport-bug-workaround.css'},
      {rel: 'stylesheet', href: '/css/dashboard.css'}
    ],
    script: [
      {src: '/js/ie8-responsive-file-warning.js'},
      {src: '/js/ie-emulation-modes-warning.js'},
      {src: '/js/jquery.min.js'},
      {src: '/js/bootstrap.min.js'},
      {src: '/js/holder.min.js'},
      {src: '/js/ie10-viewport-bug-workaround.js'}
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
