/**
 * Created by gaga on 2017/4/30.
 */
import Vue from 'vue'

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