import FastClick from '../src/libs/fastclick.js'
import touch from '../src/libs/touch.js'
import { createMetaManager, plugin as vueMetaPlugin } from 'vue-meta'

import vhPageAnimation from '../src/components/page-animation/index.vue'
import vhPage from '../src/components/page/index.vue'
import vhHeader from '../src/components/page/header.vue'
import vhScroller from '../src/components/scroller/index.vue'

import vhDevice from '../src/plugins/device/index.js'
import vhHistory from '../src/plugins/history/index.js'
import vhVueEventBus from '../src/plugins/vue-event-bus/index.js'
import vhVueHook from '../src/plugins/vue-hook/index.js'


let fastClick = FastClick.attach(document.body)

const components = [
  vhPageAnimation,
  vhPage,
  vhHeader,
  vhScroller
]

const install = function (app, { store, router }) {
  app.config.globalProperties.$fastClick = fastClick
  app.config.globalProperties.$touch = touch
  components.map(component => {
    app.component(component.name, component)
  })
  app.use(createMetaManager())
  app.use(vueMetaPlugin)
  app.use(vhVueEventBus)
  app.use(vhVueHook)

  if (store) {
    vhDevice(store)
    if (router) vhHistory(store, router)
  }

}

export {
  vhPageAnimation,
  vhPage,
  vhHeader,
  vhScroller,
  vhDevice,
  vhHistory,
  vhVueEventBus,
  vhVueHook
}
export default {
  install
}
