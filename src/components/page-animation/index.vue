<template>
  <div ref="page" class="page-touch">
    <!-- 实现右滑返回的历史页面 -->
    <div class="page back" ref="back"></div>
    <!-- end -->
    <!-- 返回阴影 -->
    <div class="page-shadow-effect" ref="shadow"></div>
    <transition
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave"
    :css="false">
      <keep-alive>
        <router-view class="page"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import {
  mapState,
  mapMutations
} from 'vuex'
import Velocity from 'velocity-animate'
import Hammer from 'hammerjs'
export default {
  name: 'vh-page-animation',
  beforeCreate () {
    // 在vuex创建page
    this.$store.registerModule('page', {
      state: {
        isBack: false, // 是否允许返回
        isDragBack: false, // 是否支持拖拽返回
        isTransitionAfter: true // 动画完成后
      },
      mutations: {
        SET_IS_DRAG_BACK (state, payload) {
          state.isDragBack = payload
        },
        SET_IS_BACK (state, payload) {
          state.isBack = payload
        },
        SET_IS_TRANSITION_AFTER (state, payload) {
          state.isTransitionAfter = payload
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
    this.back()
  },
  data () {
    return {
      duration: 0.4 * 1000, // 动画持续时间
      leaveTarget: '', // 离开页面目标
      enterTarget: '', // 进入页面目标
      translateX: '100%',
      backEl: '', // 历史页面对象
      isBack: false, // 是否正在返回
      isPanBack: false // 是否正在滑动返回
    }
  },
  computed: {
    ...mapState(['history', 'device', 'page']),
    transition () {
      return [this.animation + 'In', this.animation + 'Out']
    }
  },
  watch: {
    'history.direction' (direction) {
      switch (direction) {
        case 'forward':
          this.transitionName = this.transition[0]
          break
        case 'reverse':
          this.transitionName = this.transition[1]
          break
        default:
      }
    },
    'history.record' (record) {
      if (record.length > 1) {
        // this.backEl = record[record.length - 2].el.firstChild.cloneNode(true)
        this.backEl = {
          el: record[record.length - 2].el.cloneNode(true),
          scrollTop: record[record.length - 2].instances.$children[0].scrollTop
        }
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
              this.$refs.back.getElementsByClassName('vh-frame-main')[0].scrollTop = backEl.scrollTop
            }, 0)
          }
        }
      }, this.duration)
    }
  },
  methods: {
    ...mapMutations(['SET_IS_DRAG_BACK', 'SET_IS_TRANSITION_AFTER']),
    handler () {
      var hammer = new Hammer(this.$refs.page, {
        // touchAction: 'none',
        inputClass: Hammer.TouchInput,
        recognizers: [
          [Hammer.Pan, {
            direction: Hammer.DIRECTION_HORIZONTAL,
            threshold: 1
          }]
        ]
      })
      hammer.on('panstart', this.onPanstart)
      hammer.on('panmove', this.onPanmove)
      hammer.on('panend', this.onPanend)
    },
    // 开始进来
    beforeEnter (el) {
      el.removeAttribute('style')
      if (this.history.direction === 'forward') {
        el.style.transform = 'translate3d(0, 100%, 0)'
      }
      this.SET_IS_TRANSITION_AFTER(false)
    },
    // 进入时
    enter (el, done) {
      this.enterTarget = {
        el: el,
        done: done
      }
      switch (this.history.direction) {
        case 'forward':
          // 控制右边页面
          Velocity(el, {
            translateX: ['0%', '100%']
          }, {
            duration: this.duration,
            complete: () => {
              el.removeAttribute('style')
              done()
            }
          })
          this.onAnimateShadow(['0%', '100%'], ['1', '0'], this.duration)
          break
        case 'reverse':
          // 控制左边页面
          if (this.isPanBack) {
            el.removeAttribute('style')
            done()
          } else {
            el.style.zIndex = '-1'
            if (this.device.os.ios) {
              Velocity(el, {
                translateX: ['0%', '-20%']
              }, {
                duration: this.duration,
                complete: () => {
                  el.removeAttribute('style')
                  done()
                }
              })
            } else {
              setTimeout(() => {
                el.removeAttribute('style')
                done()
              }, this.duration)
            }
          }
          break
        default:
      }
    },
    // 进入后
    afterEnter () {
      this.isPanBack = false
      this.SET_IS_TRANSITION_AFTER(true)
      setTimeout(() => {
        this.$bus('onTransitionAfter')
      }, 100)
    },
    // 开始离开
    beforeLeave (el) {
      el.removeAttribute('style')
    },
    // 离开时
    leave (el, done) {
      switch (this.history.direction) {
        case 'forward':
          // 控制左边页面
          el.style.zIndex = '-1'
          if (this.device.os.ios) {
            Velocity(el, {
              translateX: ['-20%', '0%']
            }, {
              duration: this.duration,
              complete: () => {
                done()
              }
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
            Velocity(el, {
              translateX: ['100%', '0%']
            }, {
              duration: this.duration,
              complete: () => {
                done()
              }
            })
            this.onAnimateShadow(['100%', '0%'], ['0', '1'], this.duration)
          }
          break
        default:
      }
    },
    // 离开后
    afterLeave (el) {
    },
    // 滑动开始
    onPanstart (e) {
      if (!this.isBack && this.page.isDragBack && ((e.direction === 4) && (Math.abs(e.angle) < 20)) && this.backEl) {
        this.enterTarget.el.style.touchAction = 'none'
        e.preventDefault()
        this.isBack = true
        this.onPanmove(e)
      }
    },
    // 滑动中
    onPanmove (e) {
      if (this.isBack) {
        e.preventDefault()
        let scale = e.deltaX / document.body.clientWidth
        if (scale < 0) {
          scale = 0
        }
        if (this.device.os.ios) {
          this.$refs.back.style.transform = `translate3d(${scale * 100 * 0.2 - 20}%, 0, 0)`
        }
        this.enterTarget.el.style.transform = `translate3d(${scale * 100}%, 0, 0)`
        this.onAnimateShadow(scale * 100, (1 - scale) * 1, 0)
      }
    },
    // 滑动结束
    onPanend (e) {
      if (this.isBack) {
        e.preventDefault()
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
        Velocity(this.enterTarget.el, {
          translateX: [enterTranslateX, `${scale * 100}%`]
        }, {
          duration: duration,
          complete: () => {
            if (back) {
              if (this.history.record.length > 1) {
                this.$router.push(this.history.record[this.history.record.length - 2])
              }
            }
            setTimeout(() => {
              this.isBack = false
            }, 0)
            this.SET_IS_DRAG_BACK(true)
          }
        })
        this.onAnimateShadow([enterTranslateX, `${scale * 100}%`], '0', duration)
        if (this.device.os.ios) {
          Velocity(this.$refs.back, {
            translateX: [backTranslateX, `${scale * 100 * 0.2 - 20}%`]
          }, {
            duration: duration
          })
        }
      }
    },
    // 控制阴影移动
    onAnimateShadow (translateX, opacity, duration) {
      if (duration === 0) {
        this.$refs.shadow.style.transform = `translate3d(${translateX}%, 0, 0)`
        this.$refs.shadow.style.opacity = opacity
      } else {
        Velocity(this.$refs.shadow, {
          translateX: translateX,
          opacity
        }, {
          duration: duration,
          complete: () => {
            this.$refs.shadow.removeAttribute('style')
          }
        })
      }
    },
    plusReady (event) {
      if (window.plus) {
        event()
      } else {
        document.addEventListener('plusready', event, false)
      }
    },
    back () {
      this.plusReady(() => {
        window.plus.key.addEventListener('backbutton', () => {
          if (this.isBack) return
          if (!this.page.isBack) {
            // 把应用切换到后台运行
            this.$native.moveTaskToBack()
          } else {
            if (this.history.record.length > 1) {
              this.$router.push(this.history.record[this.history.record.length - 2])
            }
          }
        }, false)
      })
    }
  }
}
</script>
<style>
 html,body {
  width:100%;
  height:100%;
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
    background: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 96%, rgba(0, 0, 0, 0.2) 100%);
  }
</style>
