<template>
  <div class="vh-frame" ref="page">
    <!-- 页头 -->
    <header ref="header">
      <slot name="header">
        <vh-header :options="config.header">
          <slot name="header-title"></slot>
          <slot name="header-right" slot="header-right"></slot>
        </vh-header>
      </slot>
    </header>
    <!-- 页头 end-->
    <!-- 内容 -->
    <div class="vh-frame-main" :style="mainStyle" ref="main">
      <slot></slot>
    </div>
    <!-- 内容 end-->
    <!-- 页脚 -->
    <footer ref="footer">
      <slot name="footer"></slot>
    </footer>
    <!-- 页脚 end-->
  </div>
</template>

<script>
import vhHeader from './header.vue'
import {
  mapState,
  mapMutations
} from 'vuex'
export default {
  name: 'vh-page',
  created () {
    this.path = this.$route.path
  },
  mounted () {
    this.$nextTick(() => {
      this.getHeadAndFeetHeight()
      this.onScroll()
    })
  },
  forward () {
  },
  back () {
    this.onRecoveryScroll()
  },
  components: {
    vhHeader
  },
  data () {
    return {
      path: '',
      default: {
        back: true,
        backgroundColor: '#fff',
        header: {}
      },
      main: {
        top: '44',
        bottom: '0'
      },
      scrollTop: 0
    }
  },
  activated () {},
  watch: {},
  computed: {
    ...mapState(['device', 'history']),
    config () {
      return {
        ...this.default,
        ...this.options
      }
    },
    mainStyle () {
      return {
        top: `${this.main.top}px`,
        bottom: `${this.main.bottom}px`,
        backgroundColor: this.config.backgroundColor
      }
    }
  },
  eventBus: {
    onTransitionAfter () {
      if ((this.history.activate === this.path)) {
        if (this.config.back) {
          this.SET_IS_DRAG_BACK(true)
        } else {
          this.SET_IS_DRAG_BACK(false)
        }
      }
    }
  },
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    ...mapMutations(['SET_IS_DRAG_BACK']),
    // 获取头和脚高度
    getHeadAndFeetHeight () {
      if (!this.fullScreen) {
        this.main = {
          top: this.$refs.header.offsetHeight,
          bottom: this.$refs.footer.offsetHeight
        }
      }
    },
    // 记录滚动位置
    onScroll () {
      if (!this.$refs.main) return
      this.$refs.main.onscroll = (e) => {
        this.scrollTop = e.target.scrollTop
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
    touch-action: pan-y;
  }

  .vh-frame-main {
    top: 44px;
    bottom: 0;
    box-sizing: border-box;
    position: absolute;
    width: 100%;
    /* touch-action: pan-y; */
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    /* user-zoom: none; */
    -webkit-user-drag: none;
    background-color: #fff;
  }

  footer {
    position: absolute;
    width: 100%;
    bottom: 0;
    height: auto;
    z-index: 10;
    background: #fff;
    overflow: hidden;
    touch-action: pan-y;
  }

</style>
