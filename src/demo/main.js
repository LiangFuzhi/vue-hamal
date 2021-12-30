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

// app.config.errorHandler = (err, vm, info) => {
//   console.error('errorHandler:', err)
//   vm.$log.write({
//     'error': err.message,
//     'hook': info
//   })
// }
consoleLog.buddha()

app.use(vueHamal, {
  store,
  router
})

// app.$log.init()

// window.Promise.prototype.catch = function (onRejected) {
//   return this.then(null, (err) => {
//     console.error('prototype:', err.message)
//     if (err.message) {
//       app.$log.write({
//         'error': err.message,
//         'remarks': 'Promise error'
//       })
//     }
//     onRejected(err)
//   })
// }
// window.onerror = function (msg, url, line) {
//   console.error('onerror:', msg)
//   app.$log.write({
//     'url': url,
//     'error': msg,
//     'line': line
//   })
// }

app.mount("#app")
