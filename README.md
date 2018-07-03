# vue-hamal

> 基于vue + router + Vuex + hbuilder写的webapp快速构建工具，可以单独运行在web端。主要实现了页面切换管理

## 如何使用
npm
```
npm install vue-hamal --save
```
yarn
```
yarn add vue-hamal --save
```

## 基本用法

main.js
``` javascript
import Vue from 'vue'
import router from '@/demo/router/index.js'
import vueHamal from 'vue-hamal'
import App from './App'
import FastClick from 'fastclick'
import Vuex from 'vuex'

Vue.config.productionTip = false
// 记录错误
Vue.config.errorHandler = (err, vm, info) => {
  console.error('errorHandler:', err)
  Vue.$log.write({
    'error': err.message,
    'hook': info
  })
}
// 记录错误
window.Promise.prototype.catch = function (onRejected) {
  return this.then(null, (err) => {
    console.error('prototype:', err.message)
    if (err.message) {
      Vue.$log.write({
        'error': err.message,
        'remarks': 'Promise error'
      })
    }
    onRejected(err)
  })
}
// 删除点击延时
FastClick.attach(document.body)
Vue.use(Vuex)
let store = new Vuex.Store({
  strict: false
})

Vue.use(vueHamal, {
  store: store,
  router: router
})
// 初始化日记功能
Vue.$log.init()
window.onerror = function (msg, url, line) {
  console.error('onerror:', msg)
  Vue.$log.write({
    'url': url,
    'error': msg,
    'line': line
  })
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  // render: h => h(App),
  template: '<App/>',
  components: { App },
  router,
  store
})
```
router.js
``` javascript
// 配置页面
import Vue from 'vue'
import VueRouter from 'vue-router'
import {vhPageAnimation} from 'vue-hamal'
Vue.use(VueRouter)
// 配置页面
const routes = [{
  path: '',
  component: vhPageAnimation,
  children: [
    {path: '/', component: () => import('@/demo/components/Hello-1.vue')},
    {path: '/Hello-2', component: () => import('@/demo/components/Hello-2.vue')},
    {path: '/Hello-3', component: () => import('@/demo/components/Hello-3.vue')}
  ]
}]

export default new VueRouter({
  routes
})
```

详细用法请看src/demo，也可以下载该项目看运行效果。
``` javascript
yarn install 或 npm install
// 然后
yarn run dev 或 npm run dev
```
添加了app的钩子
``` javascript
// 前进打开页面执行
forward () {
  console.log('前进')
},
// 后退打开页面执行
back () {
  console.log('后退')
}
```