<template>
  <div>
    <!-- 下拉模块 -->
    <div class="scroller-top" ref="up">
      <!-- <spinner v-show="loadingStatus!=1" type="ios-small"></spinner> -->
      <p>{{options.up.text}}</p>
    </div>
    <!-- 下拉模块 end-->
    <!-- 内容 -->
    <div class="vh-content" ref="content">
      <slot></slot>
      <!-- <div v-else class="loading"> -->
        <!-- <spinner type="circles"></spinner> -->
        <!-- <p>页面加载中...</p> -->
      <!-- </div> -->
      <!-- 加载更多模块 end-->
      <div class="scroller-bottom">
        <!-- <img src="" alt="" /> -->
        <p>{{options.down.text}}</p>
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
      options: {
        el: {
          up: '',
          down: ''
        }, // 目标dom
        currentAction: '', // 当前操作 down up
        deltaY: 0, // 位置
        deviationY: 0, // 偏移量
        disable: false, // 禁用
        duration: 500, // 动画时间
        run: false, // 运行
        damp: 0.6, // 阻尼
        up: {
          deltaY: 60, // 悬停位置
          trigger: 50, // 触发位置
          text: '下拉刷新',
          loading: false // 加载中
        },
        down: {
          deltaY: 60, // 悬停位置
          trigger: 50, // 触发位置
          text: '我是有底线的',
          loading: false // 加载中
        }
      },
      scrollTop: 0,
      parameters: {
        bgColor: '#eee',
        refresh: false,
        loading: false,
        onLoading: true
      }
    }
  },
  computed: {
    config () {
      return Object.assign({}, this.parameters, this.parameter)
    }
  },
  props: {
    parameter: {
      type: Object,
      default: function () {
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
    hammerHandler () {
      this.options.el.main = this.$refs.content
      this.options.el.up = this.$refs.up
      var hammer = new Hammer(this.$refs.content, {
        touchAction: 'pan-y',
        inputClass: Hammer.TouchInput,
        recognizers: [
          [Hammer.Pan, { direction: Hammer.DIRECTION_VERTICAL }]
        ]
      })
      hammer.on('panstart', this.onPanStart)
      hammer.on('panmove', this.onPanMove)
      hammer.on('panend', this.onPanEnd)
    },
    onPanMove (event) {
      if (this.options.disable) return
      if (event.deltaY > 0 || this.options.deltaY > 0) {
        this.pandownHandler(event)
      } else {
        this.panupHandler(event)
      }
    },
    // 上拉处理器
    panupHandler () {

    },
    // 下拉处理器
    pandownHandler (event) {
      if (this.scrollTop !== 0) {
        this.options.deviationY = event.deltaY
        return
      }
      let limit = this.options.up.deltaY
      // 计算位置
      let slideY = (event.deltaY - this.options.deviationY) * this.options.damp
      if (slideY > limit) {
        slideY = limit
      }
      if (slideY > this.options.up.trigger) {
        this.options.up.text = '释放加载'
      } else {
        this.options.up.text = '下拉加载'
      }
      this.onMove(slideY)
      this.options.deltaY = slideY
    },
    onPanStart (event) {
      if (this.options.disable) return
      if (this.options.run) {
        return
      }
      this.options.run = true
    },
    onPanEnd (event) {
      if (this.options.disable) return
      this.options.deviationY = 0
      if (this.options.deltaY > this.options.up.trigger) {
        this.options.up.text = '正在加载'
        this.options.up.loading = true
      }
      // 测试
      setTimeout(() => {
        this.options.up.text = '刷新成功'
        this.options.up.loading = false
        setTimeout(() => {
          this.onReset()
        }, 500)
      }, 1000)
    },
    // 移动
    onMove (slideY) {
      let style = `translate3d(0, ${slideY}px, 0)`
      this.options.el.up.style.transform = style
      this.options.el.main.style.transform = style
    },
    // 重置位置
    onReset () {
      Velocity(this.options.el.main, {
        translateY: [0, `${this.options.deltaY}px`]
      }, {
        duration: this.duration
      })
      Velocity(this.options.el.up, {
        translateY: [0, `${this.options.deltaY}px`]
      }, {
        duration: this.duration,
        complete: () => {
          this.options.deltaY = 0
          this.options.disable = false
          this.options.run = false
        }
      })
    },
    // 记录滚动位置
    onScroll () {
      this.$refs.content.onscroll = (e) => {
        this.scrollTop = e.target.scrollTop
        if (this.options.down.loading) return
        if (e.target.clientHeight + e.target.scrollTop >= e.target.scrollHeight - this.options.down.deltaY) {
          this.options.down.loading = true
        }
      }
    },
    // 上拉加载事件
    onStartLoading () {
    },
    // 恢复滚动位置
    onRecoveryScroll () {
    },
    // 滚动到底部
    scrollBottom () {
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
  .scroller-bottom {
    text-align: center;
    height: 50px;
    color: #666;
    display: flex;
    justify-content: center;
    align-items:center;
  }
</style>
