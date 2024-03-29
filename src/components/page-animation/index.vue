/*
 * @Author: LFZ
 * @Date: 2019-04-17 18:13:49
 * @Last Modified by: LFZ
 * @Last Modified time: 2021-12-30 16:37:59
 * @Description: 页面动画
 */
<template>
  <!-- <div ref="bubble"> -->
  <div ref="page" class="page-touch">
    <!-- 实现右滑返回的历史页面 -->
    <div class="page back" ref="back"></div>
    <!-- end -->
    <!-- 返回阴影 -->
    <div class="page-shadow-effect" ref="shadow"></div>
    <router-view class="page active" ref="routerView" v-slot="{ Component }">
      <transition @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter" @before-leave="beforeLeave" @leave="leave"
        @after-leave="afterLeave">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
  <!-- </div> -->
</template>

<script>
import {
  mapState,
  mapMutations
} from 'vuex'
import anime from 'animejs'
export default {
  name: 'vh-page-animation',
  beforeCreate () {
    // 在vuex创建page
    this.$store.registerModule('page', {
      state: {
        isSlideBack: false, // 是否允许右滑手势返回
        isBack: false, // 是否允许返回
        isDragBack: false, // 是否支持拖拽返回
        isTransitionAfter: true, // 动画完成后
        isDrag: false // 是否正在拖拽
      },
      mutations: {
        SET_IS_SLIDE_BACK (state, payload) {
          state.isSlideBack = payload
        },
        SET_IS_DRAG_BACK (state, payload) {
          state.isDragBack = payload
        },
        SET_IS_BACK (state, payload) {
          state.isBack = payload
        },
        SET_IS_TRANSITION_AFTER (state, payload) {
          state.isTransitionAfter = payload
        },
        SET_IS_DRAG (state, payload) {
          state.isDrag = payload
        }
      }
    })
    // 设置meta
    var meta = document.createElement('meta')
    meta.name = 'viewport'
    meta.content = 'user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1'
    document.getElementsByTagName('head')[0].appendChild(meta)
  },
  mounted () {
    this.$nextTick(() => {
      this.handler()
      setTimeout(() => {
        this.$bus('onTransitionAfter')
      })
    })
  },
  data () {
    return {
      duration: 0.4 * 1000, // 动画持续时间
      leaveTarget: '', // 离开页面目标
      enterTarget: '', // 进入页面目标
      translateX: '100%',
      backEl: '', // 历史页面对象
      isDragBack: false, // 是否正在拖拽返回
      isSlideBack: false, // 是否正在右滑手势返回
      isPanBack: false, // 是否正在滑动返回
      disableDragBack: false // 禁用拖拉返回
    }
  },
  computed: {
    ...mapState(['history', 'device', 'page'])
  },
  watch: {
    'history.record' (record) {
      if (record.length > 1 && record[record.length - 2].el) {
        // this.backEl = record[record.length - 2].el.firstChild.cloneNode(true)
        this.backEl = {
          el: record[record.length - 2].el.cloneNode(true),
          scrollTop: record[record.length - 2].scrollTop
        }
        this.backEl.el.classList.remove('active')
      } else {
        this.backEl = ''
      }
    },
    backEl (backEl) {
      setTimeout(() => {
        if (this.$refs.back && this.$refs.back.firstChild) {
          this.$refs.back.removeChild(this.$refs.back.firstChild)
        }
        if (backEl && this.$refs.back) {
          this.$refs.back.appendChild(backEl.el)
          if (backEl.scrollTop) {
            setTimeout(() => {
              // 历史页面回到会原位置
              let scroller = this.$refs.back.getElementsByClassName('vh-scroller')
              for (const iterator of scroller) {
                iterator.scrollTop = backEl.scrollTop
              }
            }, 0)
          }
        }
      }, this.duration)
    },
    isDragBack (val) {
      this.SET_IS_DRAG(val)
    }
  },
  methods: {
    ...mapMutations(['SET_IS_DRAG_BACK', 'SET_IS_TRANSITION_AFTER', 'SET_IS_DRAG']),
    handler () {
      this.$touch({
        el: this.$refs.page,
        panstart: this.onPanStart,
        panmove: this.onPanMove,
        panend: this.onPanEnd
      })
    },
    // 阻止冒泡
    preventDefault (event) {
      event.stopImmediatePropagation() // 阻止调用相同事件的其他监听器
      event.stopPropagation() // 阻止当前冒泡或捕获阶段的进一步传播
      event.preventDefault() // 阻止默认事件
    },
    // 开始进来
    beforeEnter (el) {
      el.removeAttribute('style')
      this.enterTarget = {
        el: el
      }
      if (this.history.direction === 'forward') {
        if (!this.history.iosBack || this.history.animation) {
          el.style.transform = 'translateX(100%) translateZ(0px)'
        }
      }
      this.SET_IS_TRANSITION_AFTER(false)
    },
    // 进入时
    enter (el, done) {
      if (this.history.iosBack || !this.history.animation) {
        done()
        return
      }
      switch (this.history.direction) {
        case 'forward':
          // 控制右边页面
          anime({
            targets: el,
            translateX: ['100%', '0%'],
            translateZ: 0,
            duration: this.duration,
            complete: done,
            easing: 'easeInOutSine'
          })
          this.onAnimateShadow(['100%', '0%'], ['0', '1'], this.duration)
          break
        case 'reverse':
          // 控制左边页面
          if (this.isPanBack) {
            done()
          } else {
            el.style.zIndex = '-1'
            if (this.device.os.ios) {
              anime({
                targets: el,
                translateX: ['-20%', '0%'],
                translateZ: 0,
                duration: this.duration,
                complete: done,
                easing: 'easeInOutSine'
              })
            } else {
              setTimeout(() => {
                done()
              }, this.duration)
            }
          }
          break
        default:
      }
    },
    // 进入后
    afterEnter (el) {
      this.isPanBack = false
      this.SET_IS_TRANSITION_AFTER(true)
      if (this.history.iosBack || !this.history.animation) {
        setTimeout(() => {
          this.$bus('onTransitionAfter')
        }, 100)
      } else {
        this.$bus('onTransitionAfter')
      }
      el.removeAttribute('style')
    },
    // 开始离开
    beforeLeave (el) {
      el.removeAttribute('style')
    },
    // 离开时
    leave (el, done) {
      if (this.history.iosBack || !this.history.animation) {
        done()
        return
      }
      switch (this.history.direction) {
        case 'forward':
          // 控制左边页面
          el.style.zIndex = '-1'
          if (this.device.os.ios) {
            anime({
              targets: el,
              translateX: ['0', '-20%'],
              translateZ: 0,
              duration: this.duration,
              complete: done,
              easing: 'easeInOutSine'
            })
          } else {
            setTimeout(() => {
              done()
            }, this.duration)
          }
          break
        case 'reverse':
          // 控制右边页面
          if (this.isPanBack) {
            done()
          } else {
            anime({
              targets: el,
              translateX: ['0%', '100%'],
              translateZ: 0,
              duration: this.duration,
              complete: done,
              easing: 'easeInOutSine'
            })
            this.onAnimateShadow(['0%', '100%'], ['1', '0'], this.duration)
          }
          break
        default:
      }
    },
    // 离开后
    afterLeave (el) {
      el.removeAttribute('style')
      // el.style.display = 'none'
    },
    // 滑动开始
    onPanStart (e) {
      if (this.enterTarget && !this.isDragBack && this.page.isDragBack && ((e.direction === 4) && (Math.abs(e.angle) < 45)) && this.backEl) {
        // this.enterTarget.el.style.touchAction = 'none'
        this.preventDefault(e)
        // e.cancelBubble = true
        // e.stopPropagation()
        this.isDragBack = true
        this.onPanMove(e)
      } else if (this.enterTarget && this.page.isSlideBack && e.direction === 4 && Math.abs(e.angle) < 45) {
        this.preventDefault(e)
        this.isSlideBack = true
      }
    },
    // 滑动中
    onPanMove (e) {
      if (this.isDragBack) {
        this.preventDefault(e)
        // e.cancelBubble = true
        // e.stopPropagation()
        let scale = e.deltaX / document.body.clientWidth
        if (scale < 0) {
          scale = 0
        }
        if (this.device.os.ios) {
          this.$refs.back.style.transform = `translateX(${scale * 100 * 0.2 - 20}%) translateZ(0px)`
        }
        this.enterTarget.el.style.transform = `translateX(${scale * 100}%) translateZ(0px)`
        this.onAnimateShadow(scale * 100, (1 - scale) * 1, 0)
      } else if (this.isSlideBack) {
        this.preventDefault(e)
      }
    },
    // 滑动结束
    onPanEnd (e) {
      if (this.isDragBack) {
        this.preventDefault(e)
        // e.cancelBubble = true
        // e.stopPropagation()
        let scale = e.deltaX / document.body.clientWidth
        let back, // 是否返回
          backTranslateX, // 返回页面的位置
          enterTranslateX // 当前页面的位置
        if (scale < 0.5 && e.overallVelocityX < 0.4) {
          back = false
          enterTranslateX = '0%'
          backTranslateX = '-20%'
          if (scale < 0) scale = 0
        } else {
          this.isPanBack = true
          back = true
          enterTranslateX = '100%'
          backTranslateX = '0%'
        }
        let duration = 0 // 动画时间
        if (back) {
          duration = Math.abs(this.duration * (1 - scale))
        } else {
          duration = Math.abs(this.duration * scale)
        }
        anime({
          targets: this.enterTarget.el,
          translateX: [`${scale * 100}%`, enterTranslateX],
          translateZ: 0,
          duration: duration,
          complete: () => {
            if (back) {
              this.$router.back()
              // if (this.history.record.length > 1) {
              //   this.$router.push(this.history.record[this.history.record.length - 2])
              // }
              // vue3 router-view会自动清除style
              // setTimeout(() => {
              //   this.$refs.routerView.$el.removeAttribute('style')
              // }, 0)
            }
            setTimeout(() => {
              this.isDragBack = false
            }, 0)
            // this.SET_IS_DRAG_BACK(true)
          },
          easing: 'easeInOutSine'
        })
        this.onAnimateShadow([`${scale * 100}%`, enterTranslateX], [(1 - scale) * 1, back ? 0 : 1], duration)
        if (this.device.os.ios) {
          anime({
            targets: this.$refs.back,
            translateX: [`${scale * 100 * 0.2 - 20}%`, backTranslateX],
            translateZ: 0,
            duration: duration,
            easing: 'easeInOutSine'
          })
        }
      } else if (this.isSlideBack && this.enterTarget && this.page.isSlideBack && e.direction === 4 && Math.abs(e.angle) < 45 && e.deltaTime < 200) {
        this.preventDefault(e)
        this.isSlideBack = false
        this.$router.back()
      }
    },
    // 控制阴影移动
    onAnimateShadow (translateX, opacity, duration) {
      if (duration === 0) {
        this.$refs.shadow.style.transform = `translateX(${translateX}%) translateZ(0px)`
        this.$refs.shadow.style.opacity = opacity
      } else {
        anime({
          targets: this.$refs.shadow,
          translateX: translateX,
          translateZ: 0,
          duration: duration,
          complete: () => {
            this.$refs.shadow.removeAttribute('style')
          },
          easing: 'easeInOutSine',
          opacity
        })
      }
    }
  }
}
</script>
<style>
html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 0;
  margin: 0;
}
</style>

<style scoped>
.page-touch {
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
}
.page {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: absolute !important;
  padding: 0;
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.back {
  z-index: -1;
  /* transform: translate3d(-100%, 0, 0); */
}
.page-shadow-effect {
  position: absolute;
  top: 0;
  width: 100%;
  bottom: 0;
  /* z-index: -1; */
  content: '';
  opacity: 1;
  right: 100%;
  background: rgba(0, 0, 0, 0.05);
  /* background: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 96%, rgba(0, 0, 0, 0.2) 100%); */
}
</style>
