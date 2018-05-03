import {
  mapState
} from 'vuex'
/**
 * [VueHook 在页面准备好了的时候触发钩子]
 * @param {[type]} Vue     [description]
 * @param {[type]} options [description]
 */
function VueHook (Vue, options = {}) {
  // 注入组件
  Vue.mixin({
    computed: {
      ...mapState(['history'])
    },
    mounted () {
      this.$nextTick(() => {
        // ready页面准备完毕，只执行一遍
        var ready = this.$options.ready
        ready && ready.forEach((event) => {
          event.bind(this)()
        })
      })
    },
    activated () {
      if (this.history.direction === 'forward') {
        if (this.$options.data && this.$options.reset) {
          // 重置data
          Object.assign(this.$data, this.$options.data.bind(this)())
        }
        let forward = this.$options.forward
        forward && forward.forEach((event) => {
          event.bind(this)()
        })
      } else if (this.history.direction === 'reverse') {
        let back = this.$options.back
        back && back.forEach((event) => {
          event.bind(this)()
        })
      }
    }
  })
  var strategies = Vue.config.optionMergeStrategies
  strategies.ready = strategies.activated
  strategies.forward = strategies.activated
  strategies.back = strategies.activated
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueHook)
}
export default VueHook
