# vue-hamal

> 基于vue3 + router + Vuex快速实现原生app的页面切换效果。

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

## 手摸手，带你用vue快速撸前端页面切换效果
[https://juejin.im/post/5ecf50b06fb9a047ba31f85c](https://juejin.im/post/5ecf50b06fb9a047ba31f85c)

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
// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'
// import 'babel-polyfill' // 配置es6补丁
import { createApp } from 'vue'

import App from './App'
import * as consoleLog from '@/demo/assets/js/log.js'
import vueHamal from 'vue-hamal'
import router from '@/demo/router/index.js'
import store from '@/demo/store/index.js'

const app = createApp(App)

app.use(store)
app.use(router)

consoleLog.buddha()

app.use(vueHamal, {
  store,
  router
})

app.mount("#app")

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
import { createRouter, createWebHashHistory } from 'vue-router'

// 配置页面
const routes = [
  {
    path: '/',
    // component: vhPageAnimation, // () => import('@/demo/components/Hello-1.vue')
    component: () => import('@/demo/components/Hello-1.vue'),
    children: [
      { path: '', redirect: '/Hello-1-1' },
      { path: 'Hello-1-1', component: () => import('@/demo/components/Hello-1-1.vue'), meta: { level: 0, animation: false } },
      { path: 'Hello-1-2', component: () => import('@/demo/components/Hello-1-2.vue'), meta: { level: 1, animation: false } }
    ]
  },
  { path: '/Hello-2', component: () => import('@/demo/components/Hello-2.vue'), meta: { level: 2 } },
  { path: '/Hello-3', component: () => import('@/demo/components/Hello-3.vue'), meta: { level: 3 } }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})

```

**属性**

| 参数       | 类型            | 必须?      | 默认值        | 说明                                                          |
| --------- | --------------- | --------- | ------------ | ------------------------------------------------------------ |
| level   | Object          | Yes        | 0 | 页面层级     |
| animation   | Boolean          | No        | true | 是否有页面切换动画     |

#### 详细用法请看src/demo，也可以下载该项目看运行效果。

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
        <template v-slot:default="{sum}">
          <h1 @click="$router.push('/home/Hello-1-2')">Hello Vue 1-2!</h1>
          <h1 v-for="i in sum" :key='i' @click="$router.push('/Hello-2')">{{ msg }}</h1>
        </template>
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
  console.log('前进')
},
// 后退打开页面执行
back () {
  console.log('后退')
}
```
