import FastClick from 'fastclick'

import vhPageAnimation from '../src/components/page-animation/index.vue'
import vhPage from '../src/components/page/index.vue'
import vhHeader from '../src/components/page/header.vue'
import vhScroller from '../src/components/scroller/index.vue'

// import vhAjax from '../src/plugins/ajax/index.js'
import vhDevice from '../src/plugins/device/index.js'
import vhHistory from '../src/plugins/history/index.js'
import vhLog from '../src/plugins/log/index.js'
import vhNative from '../src/plugins/native/index.js'
import vhVueEventBus from '../src/plugins/vue-event-bus/index.js'
import vhVueHook from '../src/plugins/vue-hook/index.js'

import { warn } from '../src/tools/debug.js'

FastClick.attach(document.body)

const components = [
  vhPageAnimation,
  vhPage,
  vhHeader,
  vhScroller
]

const install = function (Vue, opts = {}) {
  components.map(component => {
    Vue.component(component.name, component)
  })

  Vue.use(vhVueEventBus)
  // Vue.use(vhAjax)
  Vue.use(vhVueHook)
  Vue.use(vhNative)
  Vue.use(vhLog)

  if (opts.store) {
    vhDevice(opts.store)
    if (opts.router) vhHistory(opts.store, opts.router)
  }

  Vue.$log.init()

  window.onerror = function (msg, url, line) {
    console.error(msg)
    Vue.$log.write({
      'url': url,
      'error': msg,
      'line': line
    })
  }

  Vue.config.errorHandler = (err, vm, info) => {
    let warnMsg = warn(`Error in ${info}: "${err.toString()}"`, vm)
    console.error(err)
    if (vm) {
      Vue.$log.write({
        'trace': warnMsg.trace,
        'error': warnMsg.msg
      })
    }
  }

  window.Promise.prototype.catch = function (rejected) {
    return this.then(null, (err) => {
      // console.error('Promise error:', err)
      if (err) {
        Vue.$log.write({
          'error': err,
          'remarks': 'Promise error'
        })
      }
      rejected(err)
    })
  }
}

export {
  vhPageAnimation,
  vhPage,
  vhHeader,
  vhScroller,
  // vhAjax,
  vhDevice,
  vhHistory,
  vhLog,
  vhNative,
  vhVueEventBus,
  vhVueHook
}
export default {
  install
}
