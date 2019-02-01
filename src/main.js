import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import fastclick from 'fastclick'
import 'common/less/index.less'
import VueLazyload from 'vue-lazyload' //图片赖加载
Vue.config.productionTip = false
// 图片懒加载
Vue.use(VueLazyload, {
  loading: require('@/common/img/default.png')
})
fastclick.attach(document.body)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
