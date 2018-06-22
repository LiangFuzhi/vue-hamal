<template>
  <div>
    <!-- 下拉模块 -->
    <div class="scroller-top" ref="up">
      <!-- <spinner v-show="loadingStatus!=1" type="ios-small"></spinner> -->
      <p>{{config.up.text}}</p>
    </div>
    <!-- 下拉模块 end-->
    <!-- 内容 -->
    <div class="vh-content" ref="content">
      <slot>
        <div class="scroller-main">
          <p>没有数据</p>
        </div>
      </slot>
      <!-- 加载更多模块 end-->
      <div v-show="!config.down.disable" class="scroller-bottom">
        <!-- <img src="" alt="" /> -->
        <p>{{config.down.text}}</p>
      </div>
      <!-- 加载更多模块 end -->
    </div>
    <!-- 内容 end-->
  </div>
</template>

<script>
import Hammer from 'hammerjs'
import Velocity from 'velocity-animate'
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
        deviationY: 0, // 偏移量
        disable: false, // 禁用
        run: false, // 运行
        damp: 0.6, // 阻尼
        up: {
          deltaY: 60, // 悬停位置
          trigger: 50, // 触发位置
          text: '下拉刷新',
          delay: 500, // 延时执行动画
          duration: 300, // 动画时间
          loading: false // 加载中
        },
        down: {
          deltaY: 60, // 悬停位置
          trigger: 50, // 触发位置
          text: '',
          loading: false, // 加载中
          pause: false, // 暂停
          disable: true // 禁用
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
  updated () {},
  filters: {},
  methods: {
    // hammer处理器
    hammerHandler () {
      this.config.el.main = this.$refs.content
      this.config.el.up = this.$refs.up
      var hammer = new Hammer(this.$refs.content, {
        touchAction: 'pan-y',
        inputClass: Hammer.TouchInput,
        recognizers: [
          [Hammer.Pan, {
            direction: Hammer.DIRECTION_VERTICAL,
            threshold: 1
          }]
        ]
      })
      hammer.on('panstart', this.onPanStart)
      hammer.on('panmove', this.onPanMove)
      hammer.on('panend', this.onPanEnd)
    },
    // 滑动开始
    onPanStart (event) {
      if (this.config.disable) return
      if (this.config.run) return
      event.preventDefault()
      this.config.run = true
      this.onPanMove(event)
    },
    // 滑动中
    onPanMove (event) {
      if (this.config.disable) return
      if (event.deltaY > 0) {
        if (this.scrollTop !== 0) {
          this.config.deviationY = event.deltaY
        } else {
          event.preventDefault()
          this.pandownHandler(event)
        }
      }
    },
    // 滑动结束
    onPanEnd (event) {
      if (this.config.disable) return
      this.config.deviationY = 0
      if (this.config.deltaY > this.config.up.trigger) {
        this.onRefresh()
      } else {
        this.onReset()
      }
    },
    // 下拉处理器
    pandownHandler (event) {
      let limit = this.config.up.deltaY
      // 计算位置
      let slideY = (event.deltaY - this.config.deviationY) * this.config.damp
      if (slideY > limit) {
        slideY = limit
      }
      if (slideY > this.config.up.trigger) {
        this.config.up.text = '释放加载'
      } else {
        this.config.up.text = '下拉加载'
      }
      this.onMove(slideY)
      this.config.deltaY = slideY
    },
    // 上拉处理器
    panupHandler (e) {
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
    // 重置位置
    onReset () {
      if (this.config.up.loading) {
        this.config.up.text = '刷新成功'
        Velocity(this.config.el.main, {
          translateY: [0, `${this.config.deltaY}px`]
        }, {
          duration: this.config.up.duration,
          delay: this.config.up.delay
        })
        Velocity(this.config.el.up, {
          translateY: [0, `${this.config.deltaY}px`]
        }, {
          duration: this.config.up.duration,
          delay: this.config.up.delay,
          complete: () => {
            this.config.up.loading = false
            this.config.disable = false
            this.config.run = false
          }
        })
        this.config.deltaY = 0
      }
    },
    // 触发刷新
    onRefresh () {
      this.config.up.text = '正在加载'
      this.config.up.loading = true
      this.$emit('on-refresh')
      // console.log('触发刷新')
    },
    // 触发加载更多
    onLoading () {
      this.config.down.text = '正在加载更多'
      this.config.down.loading = true
      this.$emit('on-loading')
      // console.log('触发加载更多')
    },
    // 暂停加载更多
    onPauseLoading () {
      this.config.down.text = '我是有底线的'
      this.config.down.pause = true
    },
    // 恢复加载更多
    onRecoveryLoading () {
      this.config.down.pause = false
      this.config.down.loading = false
      this.config.down.disable = false
      this.config.down.text = '上拉加载更多'
    },
    // 记录滚动位置
    onScroll () {
      this.$refs.content.onscroll = (e) => {
        this.scrollTop = e.target.scrollTop
        this.panupHandler(e)
      }
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
