import 'babel-polyfill' // 配置es6补丁
import Vue from 'vue'
import router from '@/demo/router/index.js'

import vueHamal from 'vue-hamal'
import App from './App'
import * as consoleLog from '@/demo/assets/js/log.js'
// import VueTouch from 'vue-touch'
import Vuex from 'vuex'

Vue.config.productionTip = false
Vue.config.errorHandler = (err, vm, info) => {
  console.error('errorHandler:', err)
  Vue.$log.write({
    'error': err.message,
    'hook': info
  })
}
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
consoleLog.buddha()
Vue.use(Vuex)
let store = new Vuex.Store({
  strict: false
})

Vue.use(vueHamal, {
  store: store,
  router: router
})

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
