/*
 * @Author: LFZ
 * @Date: 2019-04-17 18:13:06
 * @Last Modified by: LFZ
 * @Last Modified time: 2019-08-05 14:47:19
 * @Description: 滚动组件
 */
<template>
  <div>
    <!-- 下拉模块 -->
    <div class="scroller-top" ref="up">
      <slot name="up">
        <p>{{config.up.text[config.up.state]}}</p>
      </slot>
    </div>
    <!-- 下拉模块 end-->
    <!-- 内容 -->
    <div class="vh-content vh-scroller" ref="content">
      <slot>
        <div class="scroller-main">
          <p>没有数据</p>
        </div>
      </slot>
      <!-- 加载更多模块 end-->
      <div class="scroller-bottom">
        <!-- <img src="" alt="" /> -->
        <slot name="down">
          <p>{{config.down.text[config.down.state]}}</p>
        </slot>
      </div>
      <!-- 加载更多模块 end -->
    </div>
    <!-- 内容 end-->
  </div>
</template>

<script>
import Hammer from 'hammerjs'
import Velocity from 'velocity-animate'
import { mapMutations } from 'vuex'
export default {
  name: 'vh-scroller',
  mixins: [],
  components: {},
  data () {
    return {
      default: {
        el: {
          up: '',
          down: ''
        }, // 目标dom
        currentAction: '', // 当前操作 down up
        deltaY: 0, // 位置
        offsetY: 0, // 偏移量
        disable: false, // 禁用
        run: false, // 运行
        damp: 0.6, // 阻尼
        up: {
          deltaY: 60, // 悬停位置
          trigger: 50, // 触发位置
          text: ['下拉刷新', '释放刷新', '正在刷新', '刷新成功'],
          delay: 500, // 延时执行动画
          duration: 300, // 动画时间
          loading: false, // 加载中
          state: 0 // 状态码对应text下标
        },
        down: {
          deltaY: 60, // 悬停位置
          trigger: 50, // 触发位置
          text: ['上拉加载更多', '正在加载更多', '我是有底线的'],
          loading: false, // 加载中
          pause: false, // 暂停
          state: 0 // 状态码对应text下标
        }
      },
      scrollTop: 0
    }
  },
  computed: {
    config () {
      return {
        ...this.default,
        ...this.options
      }
    }
  },
  props: {
    options: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {},
  created () {},
  mounted () {
    this.$nextTick(() => {
      this.onScroll()
      this.hammerHandler()
    })
  },
  back () {
    this.onRecoveryScroll()
  },
  updated () {},
  filters: {},
  methods: {
    ...mapMutations(['SET_SCROLL_TOP']),
    // hammer处理器
    hammerHandler () {
      this.config.el.main = this.$refs.content
      this.config.el.up = this.$refs.up
      var hammer = new Hammer(this.$refs.content, {
        touchAction: 'auto',
        inputClass: Hammer.TouchInput,
        recognizers: [
          [Hammer.Pan, {
            threshold: 0,
            pointers: 0
          }]
        ]
      })
      hammer.on('panstart', this.onPanStart, { passive: false })
      hammer.on('panmove', this.onPanMove, { passive: false })
      hammer.on('panend', this.onPanEnd, { passive: false })
    },
    // 滑动开始
    onPanStart (event) {
      if (this.config.disable) return
      if (this.config.run) return
      if ((event.direction !== 16) || (Math.abs(event.angle) < 45) || (this.scrollTop !== 0)) {
        this.config.disable = true
        return
      }
      event.preventDefault()
      this.config.run = true
      this.onPanMove(event)
    },
    // 滑动中
    onPanMove (event) {
      if (this.config.disable) return
      if (event.deltaY > 0) {
        if (this.scrollTop !== 0) {
          this.config.offsetY = event.deltaY
        } else {
          event.preventDefault()
          this.pandownHandler(event)
        }
      }
    },
    // 滑动结束
    onPanEnd (event) {
      if (this.config.disable) {
        this.config.disable = false
        return
      }
      this.config.offsetY = 0
      if (this.config.deltaY > this.config.up.trigger) {
        this.onRefresh()
      } else {
        this.onReset(false)
      }
    },
    // 下拉处理器
    pandownHandler (event) {
      let limit = this.config.up.deltaY
      // 计算位置
      let slideY = (event.deltaY - this.config.offsetY) * this.config.damp
      if (slideY > limit) {
        slideY = limit
      }
      if (slideY > this.config.up.trigger) {
        this.config.up.state = 1
      } else {
        this.config.up.state = 0
      }
      this.onMove(slideY)
      this.config.deltaY = slideY
    },
    // 上拉处理器
    panupHandler (e) {
      if (this.config.down.pause) return
      if (this.config.down.loading) return
      if (e.target.clientHeight + e.target.scrollTop >= e.target.scrollHeight - this.config.down.deltaY) {
        this.onLoading()
      }
    },
    // 移动main
    onMove (slideY) {
      let style = `translate3d(0, ${slideY}px, 0)`
      this.config.el.up.style.transform = style
      this.config.el.main.style.transform = style
    },
    // 重置
    onReset (delay = true) {
      if (this.config.up.loading) {
        this.config.up.state = 3
      }
      Velocity(this.config.el.main, {
        translateY: [0, `${this.config.deltaY}px`]
      }, {
        duration: this.config.up.duration,
        delay: delay ? this.config.up.delay : 0,
        complete: () => {
          this.config.up.loading = false
          this.config.disable = false
          this.config.run = false
          this.config.el.main.style.transform = ''
        }
      })
      Velocity(this.config.el.up, {
        translateY: [0, `${this.config.deltaY}px`]
      }, {
        duration: this.config.up.duration,
        delay: delay ? this.config.up.delay : 0
      })
      this.config.deltaY = 0
      if (delay) this.onRecoveryLoading()
    },
    // 触发刷新
    onRefresh () {
      this.config.up.state = 2
      this.config.up.loading = true
      this.$emit('on-refresh')
      // console.log('触发刷新')
    },
    // 触发加载更多
    onLoading () {
      this.config.down.state = 1
      this.config.down.loading = true
      this.$emit('on-loading')
      // console.log('触发加载更多')
    },
    // 暂停加载更多
    onPauseLoading () {
      this.config.down.state = 2
      this.config.down.pause = true
    },
    // 恢复加载更多
    onRecoveryLoading () {
      this.config.down.pause = false
      this.config.down.loading = false
      this.config.down.state = 0
    },
    // 记录滚动位置
    onScroll () {
      this.$refs.content.onscroll = (e) => {
        this.scrollTop = e.target.scrollTop
        this.panupHandler(e)
        this.SET_SCROLL_TOP({
          path: this.$route.path,
          scrollTop: e.target.scrollTop
        })
      }
    },
    // 恢复滚动位置
    onRecoveryScroll () {
      if (!this.$refs.content) return
      if (this.scrollTop) {
        this.$refs.content.scrollTop = this.scrollTop
      }
    },
    // 滚动到指定位置
    onScrollTo (offset) {
      this.$refs.content.scrollTop = offset
    }
  }
}
</script>

<style lang='less' scoped>
  .vh-content {
    // margin-top: -60px;
    box-sizing: border-box;
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    -webkit-user-drag: none;
  }
  .loading {
    text-align: center;
    margin-top: 30%;
    color: #666
  }
  .scroller-top {
    position: absolute;
    top: -60px;
    width: 100%;
    text-align: center;
    height: 60px;
    color: #666;
    display: flex;
    justify-content: center;
    align-items:center;
  }
  .scroller-main {
    text-align: center;
    height: 50px;
    color: #666;
    display: flex;
    justify-content: center;
    align-items:center;
  }
  .scroller-bottom {
    text-align: center;
    height: 50px;
    color: #666;
    display: flex;
    justify-content: center;
    align-items:center;
  }
</style>
