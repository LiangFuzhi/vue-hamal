/*
 * @Author: LFZ
 * @Date: 2019-04-17 18:14:52
 * @Last Modified by: LFZ
 * @Last Modified time: 2021-11-12 15:10:18
 * @Description: 页面头部
 */
<template>
  <metainfo>
    <template v-slot:title>{{config.title}}</template>
  </metainfo>
  <div class="hamal-header" :style="hamalHeaderStyle" v-if="config.show">
    <div class="hamal-header-left" @click="onBack">
      <slot name="left">
        <i class="left-arrow" v-if="config.back" :class="{blue:config.backgroundColor == '#fff'|| config.backgroundColor == '#ffffff'}"></i>
        <span class="text" :style="{color: config.color}">
          <slot>
            {{config.title}}
          </slot>
        </span>
      </slot>
    </div>
    <div class="hamal-header-right" :style="{color: config.color}">
      <slot name="header-right"></slot>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'vh-page-header',
  mounted () {
    this.$nextTick(() => {
    })
  },
  components: {
  },
  created () {
    this.config = {
      ...this.config,
      ...this.options
    }
    this.path = this.$route.path
  },
  forward () {
    this.setBack()
  },
  back () {
    this.setBack()
  },
  eventBus: {
    onTransitionAfter () {
    }
  },
  data () {
    return {
      path: '',
      config: {
        back: true,
        backgroundColor: '#fff',
        color: '#000',
        show: true,
        title: ''
      }
    }
  },
  metaInfo () {
    return {
      title: ''
    }
  },
  computed: {
    ...mapState(['device', 'history']),
    hamalHeaderStyle () {
      return {
        backgroundColor: this.config.backgroundColor,
        paddingTop: this.device.navigation.height + 'px'
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
  watch: {
    options (val) {
      this.config = {
        ...this.config,
        ...val
      }
      this.setBack()
    }
  },
  methods: {
    ...mapMutations(['SET_IS_BACK']),
    setBack () {
      // if ((this.history.activate === this.path)) {
      if (this.config.back) {
        this.SET_IS_BACK(true)
      } else {
        this.SET_IS_BACK(false)
      }
      // }
    },
    onBack () {
      if (!this.config.back) return
      if (this.history.record.length > 1) {
        this.$router.back()
        // this.$router.push(this.history.record[this.history.record.length - 2])
      }
    }
  }
}
</script>
<style scoped lang="less">
@theme-color: #0099FF;
@menu-width: 60px;
@menu-height: 44px;
.hamal-header {
  position: relative;
  height: @menu-height;
  line-height: @menu-height;
  display: flex;
  text-align: center;
  justify-content: space-between;
  padding: 0 15px;
  font-size: 17px;
  box-sizing: content-box;
  .hamal-header-left,
  .hamal-header-right {
    position: relative;
    display: flex;
    align-items: center;
    .text {
      color: @theme-color;
    }
  }
  .hamal-header-left:active{
    opacity: 0.5;
  }
}
// .hamal-header:after {
//   content: '';
//   position: absolute;
//   background-color: #c4c4c4;
//   display: block;
//   z-index: 15;
//   top: auto;
//   right: auto;
//   bottom: 0;
//   left: 0;
//   height: 1px;
//   width: 100%;
//   -webkit-transform-origin: 50% 100%;
//   transform-origin: 50% 100%;
//   transform: scaleY(.5);
// }

// 箭头部分
.left-arrow {
  width: 31px;
  height: 44px;
}

.blue.left-arrow:before {
  background-color: @theme-color;
}
.blue.left-arrow:after {
  border-right: 2px solid @theme-color;
  border-top: 2px solid @theme-color;
}

.left-arrow:before {
  content: '';
  display: block;
  width: 14px;
  height: 2px;
  background-color: #fff;
  position: absolute;
  top: calc(50% - 1px);
  left: 2.5px;
}

.left-arrow:after {
  content: '';
  display: block;
  width: 10px;
  height: 10px;
  border-right: 2px solid #fff;
  border-top: 2px solid #fff;
  // 箭头方向可以自由切换角度
  transform: rotate(-135deg);
  transform-origin:50% 50%;
  position: absolute;
  top: calc(50% - 6px);
  left: 2.5px;
}
</style>
