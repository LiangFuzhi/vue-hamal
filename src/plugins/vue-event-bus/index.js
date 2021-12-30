import mitt from 'mitt'
/**
 * [appEventHub 事件中心]
 * @param {[type]} app     [description]
 * @param {[type]} options [description]
 */
function appEventBus (app) {
  const emitter = mitt()
  // 注入组件
  app.mixin({
    mounted () {
      var events = this.$options.eventBus || false
      if (events) {
        for (var eventName in events) {
          if (typeof this.$options.eventBus[eventName] === 'string') {
            emitter.on(eventName, this[this.$options.eventBus[eventName]].bind(this))
          } else if (typeof this.$options.eventBus[eventName] === 'function') {
            emitter.on(eventName, this.$options.eventBus[eventName].bind(this))
          }
        }
      }
    }
  })
  // 添加实例方法
  app.config.globalProperties.$bus = (eventName, options) => {
    emitter.emit(eventName, options)
  }
  var strategies = app.config.optionMergeStrategies
  strategies.events = strategies.methods
}

export default {
  install: appEventBus
}
