// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueResource from 'vue-resource'

import goods from './components/goods/goods'
import orders from './components/orders/orders'
import seller from './components/seller/seller'

// import './common/stylus/index.styl'
// import router from './router'

import VueRouter from 'vue-router' // 引入路由组件
// 注册路由
Vue.use(VueRouter)
// 注册VueResource
Vue.use(VueResource)
Vue.config.productionTip = false

const routes = [
  {path: '/goods', component: goods},
  {path: '/orders', component: orders},
  {path: '/seller', component: seller},
  {path: '/', redirect: '/goods'}
]
const router = new VueRouter({
  routes: routes,
  linkActiveClass: 'active'
})

/* eslint-disable no-new */
new Vue({
  el: '#app', // 提供一个在页面上已经存在的 DOM 元素作为 Vue 实例挂载目标
  router,
  render: h => h(App)
  // components: {App},
  // template: '<App/>'
})
