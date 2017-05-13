/**
 * Created by gaga on 2017/4/30.
 */
import Vue from 'vue'
import head from '../components/Head.vue'
const MarkdownIt = require('markdown-it')
const md = new MarkdownIt();

Vue.component('vue-head', head)
// 注册
Vue.filter('prettyTime', function (value) {
  // 返回处理后的值
  let s = (new Date() - new Date(value)) / 1000
  /**
   * 如果
   *  小于 一分钟 显示几秒前
   *  小于 一小时 显示几分前
   *  小于 24小时 显示几小时前
   *  其余 显示几天前
   */
  if (s < 60) {
    return parseInt(s) + '秒前'
  } else if (s < 60 * 60) {
    return parseInt(s / 60) + '分钟前'
  } else if (s < 60 * 60 * 24) {
    return parseInt(s / (60 * 60)) + '小时前'
  } else {
    return parseInt(s / (60 * 60 * 24)) + '天前'
  }
})
Vue.filter('prettyTime02', function (value) {
  // 2017-05-05
  let d = new Date(value)

  function per (num) {
    if (num < 10) {
      return '0' + num
    } else return num
  }

  return d.getFullYear() + '-' + per(d.getMonth() + 1) + '-' + per(d.getDate())
})
Vue.filter('md', function (value) {
  return md.render(value)
})