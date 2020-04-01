/*
 * @Author: LFZ
 * @Date: 2019-04-17 18:14:04
 * @Last Modified by: LFZ
 * @Last Modified time: 2019-11-06 16:19:08
 * @Description: 页面主题
 */
<template>
  <div class="vh-frame" ref="page">
    <slot name="top"></slot>
    <!-- 页头 -->
    <header ref="header">
      <slot name="header">
        <slot name="header-top"></slot>
        <vh-header :options="config.header">
          <slot name="header-title"></slot>
          <slot name="header-right" slot="header-right"></slot>
        </vh-header>
        <slot name="header-bottom"></slot>
      </slot>
    </header>
    <!-- 页头 end-->
    <!-- 内容 -->
    <div class="vh-frame-main vh-scroller" :style="mainStyle" ref="main">
      <slot v-if="show">
        <div class="main">
          <p>没有数据</p>
        </div>
      </slot>
      <!-- <div class="load" v-else>
        <span>正在加载</span>
      </div> -->
    </div>
    <!-- 内容 end-->
    <!-- 页脚 -->
    <footer ref="footer">
      <slot name="footer"></slot>
    </footer>
    <!-- 页脚 end-->
    <slot name="bottom"></slot>
  </div>
</template>

<script>
import vhHeader from './header.vue'
import nprogress from 'nprogress'
import {
  mapState,
  mapMutations
} from 'vuex'
export default {
  name: 'vh-page',
  beforeCreate () {},
  created () {
    this.config = {
      ...this.config,
      ...this.options
    }
    if (!this.history.firstOpen) {
      nprogress.start()
      this.SET_LAZY(this.config.lazy)
      this.config.lazy && (this.show = false)
    } else {
      this.SET_LAZY(false)
    }
    this.path = this.$route.path
    this.getHeadAndFeetHeight()
  },
  mounted () {
    this.$nextTick(() => {
      this.onScroll()
      if (!this.history.firstOpen) {
        setTimeout(() => {
          nprogress.done()
        }, this.history.animation ? 400 : 0)
        if (this.config.lazy && !this.show) {
          setTimeout(() => {
            this.show = true
          }, this.history.animation ? 400 : 0)
        }
      }
    })
  },
  forward () {
    this.setBack()
  },
  back () {
    this.onRecoveryScroll()
    this.setBack()
  },
  components: {
    vhHeader
  },
  data () {
    return {
      path: '',
      config: {
        back: true,
        backgroundColor: '#fff',
        lazy: true,
        header: {}
      },
      main: {
        top: '44',
        bottom: '0'
      },
      scrollTop: 0,
      show: true,
      intervalId: ''
    }
  },
  activated () {
    this.getHeadAndFeetHeight()
  },
  deactivated () {
    this.destroyInterval()
  },
  beforeDestroy () {
    this.destroyInterval()
  },
  watch: {
    options (val) {
      this.config = {
        ...this.config,
        ...val
      }
    }
  },
  computed: {
    ...mapState(['device', 'history']),
    mainStyle () {
      return {
        top: `${this.main.top}px`,
        bottom: `${this.main.bottom}px`,
        backgroundColor: this.config.backgroundColor
      }
    }
  },
  eventBus: {
    onTransitionAfter () {}
  },
  props: {
    options: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    ...mapMutations(['SET_IS_DRAG_BACK', 'SET_SCROLL_TOP', 'SET_LAZY']),
    // 设置是否允许返回
    setBack () {
      // if ((this.history.activate === this.path)) {
      if (this.config.back) {
        this.SET_IS_DRAG_BACK(true)
      } else {
        this.SET_IS_DRAG_BACK(false)
      }
      // }
    },
    // 删除定时器
    destroyInterval () {
      if (this.intervalId) {
        clearInterval(this.intervalId)
        this.intervalId = ''
      }
    },
    // 获取头和脚高度
    getHeadAndFeetHeight () {
      if (!this.fullScreen) {
        this.main = {
          // getBoundingClientRect精确拿到高度，精确到小数
          top: this.$refs.header ? this.$refs.header.getBoundingClientRect().height : 0,
          bottom: this.$refs.footer ? this.$refs.footer.getBoundingClientRect().height : 0
        }
        this.destroyInterval()
        this.intervalId = setInterval(this.getHeadAndFeetHeight, 200)
      }
    },
    // 记录滚动位置
    onScroll () {
      if (!this.$refs.main) return
      this.$refs.main.onscroll = (e) => {
        this.scrollTop = e.target.scrollTop
        this.SET_SCROLL_TOP({
          path: this.$route.path,
          scrollTop: e.target.scrollTop
        })
      }
    },
    // 恢复滚动位置
    onRecoveryScroll () {
      if (!this.$refs.main) return
      if (this.scrollTop) {
        this.$refs.main.scrollTop = this.scrollTop
      }
    }
  }
}
</script>
<style>
@import 'nprogress/nprogress.css';
</style>
<style scoped>
  .vh-frame {
    height: 100%;
    width: 100%;
    position: relative;
    user-select: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    outline: none;
  }

  header {
    z-index: 10;
    position: absolute;
    top: 0;
    width: 100%;
    background: #fff;
    overflow: hidden;
  }

  .vh-frame-main {
    top: 44px;
    bottom: 0;
    box-sizing: border-box;
    position: absolute;
    width: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    /* user-zoom: none; */
    -webkit-user-drag: none;
    background-color: #fff;
  }
  .main {
    text-align: center;
    height: 50px;
    color: #666;
    display: flex;
    justify-content: center;
    align-items:center;
  }

  footer {
    position: absolute;
    width: 100%;
    bottom: 0;
    height: auto;
    z-index: 10;
    background: #fff;
    overflow: hidden;
  }
  .load {
    text-align: center;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
