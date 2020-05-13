/*
 * @Author: LFZ
 * @Date: 2019-04-17 18:13:06
 * @Last Modified by: LFZ
 * @Last Modified time: 2020-05-13 15:49:12
 * @Description: 滚动组件
 */
<template>
  <div>
    <!-- 下拉模块 -->
    <div class="scroller-top" ref="up">
      <slot name="up">
        <p>{{config.up.text[up.state]}}</p>
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
          <p>{{config.down.text[down.state]}}</p>
        </slot>
      </div>
      <!-- 加载更多模块 end -->
    </div>
    <!-- 内容 end-->
  </div>
</template>

<script>
import Hammer from 'hammerjs'
import anime from 'animejs/lib/anime.es.js'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'vh-scroller',
  mixins: [],
  components: {},
  data () {
    return {
      el: {
        up: '',
        down: ''
      }, // 目标dom
      deltaY: 0, // 位置
      offsetY: 0, // 偏移量
      isAnimeRun: false, // 运行动画
      damp: 0.6, // 阻尼
      default: {
        up: {
          deltaY: 60, // 悬停位置
          trigger: 50, // 触发位置
          text: ['下拉刷新', '释放刷新', '正在刷新', '刷新成功'],
          delay: 500, // 延时执行动画
          duration: 300 // 动画时间
        },
        down: {
          deltaY: 60, // 悬停位置
          trigger: 50, // 触发位置
          text: ['上拉加载更多', '正在加载更多', '我是有底线的'],
          pause: false // 暂停
        }
      },
      up: {
        loading: false, // 加载中
        state: 0 // 状态码对应text下标
      },
      down: {
        loading: false, // 加载中
        state: 0 // 状态码对应text下标
      },
      scrollTop: 0, // 滚动位置
      isDrag: false // 正在拖拽
    }
  },
  computed: {
    ...mapState(['page']),
    config () {
      let up = {
        ...this.default.up,
        ...this.options.up
      }
      let down = {
        ...this.default.down,
        ...this.options.down
      }
      return {
        up,
        down
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
      this.el.main = this.$refs.content
      this.el.up = this.$refs.up
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
      hammer.on('panstart', this.onPanStart)
      hammer.on('panmove', this.onPanMove)
      hammer.on('panend', this.onPanEnd)
    },
    // 阻止冒泡
    preventDefault (event) {
      event.stopImmediatePropagation() // 阻止调用相同事件的其他监听器
      event.stopPropagation() // 阻止当前冒泡或捕获阶段的进一步传播
      event.preventDefault() // 阻止默认事件
    },
    // 滑动开始
    onPanStart (event) {
      if (this.isAnimeRun || this.page.isDrag) {
        return
      }
      if ((event.direction !== 16) || (Math.abs(event.angle) < 45) || (this.scrollTop !== 0)) {
        return
      }
      this.isDrag = true
      this.preventDefault(event.srcEvent)
      this.onPanMove(event)
    },
    // 滑动中
    onPanMove (event) {
      if (this.isAnimeRun || !this.isDrag || this.page.isDrag) {
        return
      }
      if (event.deltaY > 0 || event.deltaY === 0) {
        if (this.scrollTop !== 0) {
          this.offsetY = event.deltaY
        } else {
          this.preventDefault(event.srcEvent)
          this.pandownHandler(event)
        }
      }
    },
    // 滑动结束
    onPanEnd (event) {
      if (this.isAnimeRun || !this.isDrag || this.page.isDrag) {
        return
      }
      this.preventDefault(event.srcEvent)
      this.isDrag = false
      this.isAnimeRun = true
      this.offsetY = 0
      if (this.deltaY > this.config.up.trigger) {
        this.onRefresh()
      } else {
        this.onReset(false)
      }
    },
    // 下拉处理器
    pandownHandler (event) {
      let limit = this.config.up.deltaY
      // 计算位置
      let slideY = (event.deltaY - this.offsetY) * this.damp
      if (slideY > limit) {
        slideY = limit
      }
      if (slideY > this.config.up.trigger) {
        this.up.state = 1
      } else {
        this.up.state = 0
      }
      this.onMove(slideY)
      this.deltaY = slideY
    },
    // 上拉处理器
    panupHandler (e) {
      if (this.down.pause) return
      if (this.down.loading) return
      if (e.target.clientHeight + e.target.scrollTop >= e.target.scrollHeight - this.config.down.deltaY) {
        this.onLoading()
      }
    },
    // 移动main
    onMove (slideY) {
      let style = `translateY(${slideY}px) translateZ(0px)`
      this.el.up.style.transform = style
      this.el.main.style.transform = style
    },
    // 重置
    onReset (delay = true) {
      if (this.up.loading) {
        this.up.state = 3
      }
      anime({
        targets: this.el.main,
        translateY: [`${this.deltaY}px`, '0px'],
        translateZ: 0,
        duration: this.config.up.duration,
        delay: delay ? this.config.up.delay : 0,
        complete: () => {
          this.up.loading = false
          this.isAnimeRun = false
          // 清空transform在ios端会无端端白屏不渲染
          // this.el.main.style.transform = ''
        },
        easing: 'easeInOutSine'
      })
      anime({
        targets: this.el.up,
        translateY: [`${this.deltaY}px`, '0px'],
        translateZ: 0,
        duration: this.config.up.duration,
        delay: delay ? this.config.up.delay : 0,
        easing: 'easeInOutSine'
      })
      this.deltaY = 0
      if (delay) this.onRecoveryLoading()
    },
    // 触发刷新
    onRefresh () {
      this.up.state = 2
      this.up.loading = true
      this.$emit('on-refresh')
      // console.log('触发刷新')
    },
    // 触发加载更多
    onLoading () {
      this.down.state = 1
      this.down.loading = true
      this.$emit('on-loading')
      // console.log('触发加载更多')
    },
    // 暂停加载更多
    onPauseLoading () {
      this.down.state = 2
      this.down.pause = true
    },
    // 恢复加载更多
    onRecoveryLoading () {
      this.down.pause = false
      this.down.loading = false
      this.down.state = 0
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
