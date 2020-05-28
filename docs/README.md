# vue-hamal

> 基于vue + router + Vuex写的webapp快速构建工具，可以单独运行在web端。实现了页面切换管理

<a href="https://github.com/LiangFuzhi/vue-hamal/issues">
  <img src="https://img.shields.io/github/issues/LiangFuzhi/vue-hamal.svg?style=flat-square" alt="">
</a>
<a href="https://github.com/LiangFuzhi/vue-hamal/issues">
  <img src="http://isitmaintained.com/badge/resolution/LiangFuzhi/vue-hamal.svg?style=flat-square" alt="">
</a>
<a href="https://github.com/LiangFuzhi/vue-hamal/graphs/contributors">
  <img src="https://img.shields.io/github/contributors/LiangFuzhi/vue-hamal.svg?style=flat-square" alt="">
</a>
<br/>
<a href="https://www.npmjs.com/package/vue-hamal">
  <img src="https://img.shields.io/npm/l/vue-hamal.svg?style=flat-square" alt="">
</a>
<a href="https://www.npmjs.com/package/vue-hamal">
  <img src="https://img.shields.io/npm/v/vue-hamal.svg?style=flat-square" alt="">
</a>
<a href="https://www.npmjs.com/package/vue-hamal">
  <img src="https://img.shields.io/npm/dm/vue-hamal.svg?style=flat-square" alt="">
</a>
<a href="https://www.npmjs.com/package/vue-hamal">
  <img src="https://img.shields.io/npm/dt/vue-hamal.svg?style=flat-square" alt="">
</a>

## 在线例子
[https://liangfuzhi.github.io/vue-hamal/dist/index.html](https://liangfuzhi.github.io/vue-hamal/dist/index.html)

## 在线文档
[https://liangfuzhi.github.io/vue-hamal/docs](https://liangfuzhi.github.io/vue-hamal/docs)

## 如何使用
npm
```
npm install vue-hamal --save
```
yarn
```
yarn add vue-hamal --save
```

> 注意：使用vue-cli3生成的项目需要配置

vue.config.js
``` javascript
module.exports = {
  transpileDependencies: ['vue-hamal/src'], // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来
}
```
babel.config.js
``` javascript
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  // 表明代码应该解析的模式。可以是 "script"，"module" 或者 "unambiguous" 中任意一个。默认为 "script"。"unambiguous" 将使得 Babylon 尝试根据 ES6 的 import 或者 export 声明来进行推测。具有 ES6 import 和 export 的文件被认为是 "module"，否则被认为是 "script"
  sourceType: 'unambiguous'
}
```

## 基本用法

## main.js

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

## app.vue

``` vue
<template>
  <vh-page-animation></vh-page-animation>
</template>

<script>
export default {
  name: 'app',
  mounted: function () {
    this.$nextTick(function () {
    })
  },
  data () {
    return {}
  },
  computed: {
  },
  watch: {
  },
  methods: {
  }
}
</script>

```

## router.js

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
    {path: '/', component: () => import('@/demo/components/Hello-1.vue'), meta: {level: 0, animation: false}},
    {path: '/Hello-2', component: () => import('@/demo/components/Hello-2.vue'), meta: {level: 1, animation: false}},
    {path: '/Hello-3', component: () => import('@/demo/components/Hello-3.vue'), meta: {level: 2, animation: false}}
  ]
}]

export default new VueRouter({
  routes
})
```

**属性**

| 参数       | 类型            | 必须?      | 默认值        | 说明                                                          |
| --------- | --------------- | --------- | ------------ | ------------------------------------------------------------ |
| level   | Object          | Yes        | 0 | 页面层级     |
| animation   | Boolean          | No        | true | 是否有页面切换动画     |

#### 详细用法请看src/demo，也可以下载该项目看运行效果。

``` javascript
yarn install 或 npm install
// 然后
yarn run dev 或 npm run dev
```

## Hello-1.vue

``` vue
<template>
  <div>
    <vh-page :options="options">
      <vh-tabel>
        <div slot-scope="{sum}">
          <router-link to="/home/Hello-1-2" tag="a">
            <h1>Hello Vue 1-2!</h1>
          </router-link>
          <router-link to="/Hello-2" tag="a">
            <h1 v-for="i in sum" :key='i'>{{ msg }}</h1>
          </router-link>
        </div>
      </vh-tabel>
    </vh-page>
  </div>
</template>

<script>
import vhTabel from './vh-tabel.vue'
export default {
  name: 'demo-1-1',
  mounted () {
    this.$nextTick(() => {})
  },
  data () {
    return {
      // sum: 15,
      msg: 'Hello Vue 1-1!',
      options: {
        dragBack: false,
        backgroundColor: '#eee',
        header: {
          title: '页面-1-1',
          back: false,
          backgroundColor: '#fff',
          color: '#000',
          show: true
        }
      }
    }
  },
  components: {
    vhTabel
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #42b983;
}
</style>
```

**属性**

| 参数       | 类型            | 必须?      | 默认值        | 说明                                                          |
| --------- | --------------- | --------- | ------------ | ------------------------------------------------------------ |
| options   | Object          | No        | 往下看 | 配置页面信息     |
| options.dragBack   | Boolean          | No        | true | 右滑拖动返回     |
| options.slideBack   | Boolean          | No        | true | 右滑手势返回     |
| options.backgroundColor   | String          | No        | #fff | 页面背景色     |
| options.lazy   | Boolean          | No        | true | 页面懒加载     |
| options.header   | Object          | No        | {} | 配置页面信息     |

## 钩子

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
