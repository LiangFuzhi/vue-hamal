/**
 * [VueEventHub 事件中心]
 * @param {[type]} Vue     [description]
 * @param {[type]} options [description]
 */
function VueEventBus (Vue, options = {}) {
  // 将在各处使用该事件中心
  // 组件通过它来通信
  // global 定义全局变量
  var eventHub = new Vue()
  // var config = {}
  // var parameter = Object.assign(config, options)
  // 注入组件
  Vue.mixin({
    mounted () {
      var events = this.$options.eventBus || false
      if (events) {
        for (var eventName in events) {
          if (typeof this.$options.eventBus[eventName] === 'string') {
            eventHub.$on(eventName, this[this.$options.eventBus[eventName]].bind(this))
          } else if (typeof this.$options.eventBus[eventName] === 'function') {
            eventHub.$on(eventName, this.$options.eventBus[eventName].bind(this))
          }
        }
      }
    }
  })
  // 添加实例方法
  Vue.prototype.$bus = (eventName, options) => {
    eventHub.$emit(eventName, options)
  }
  var strategies = Vue.config.optionMergeStrategies
  strategies.events = strategies.methods
}
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueEventBus)
}
export default {
  install: VueEventBus
}
