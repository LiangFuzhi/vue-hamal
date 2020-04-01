export default (store, router) => {
  store.registerModule('history', {
    state: {
      isLoading: false, // 是否加载
      direction: 'forward', // 状态
      iosBack: false, // ios返回
      firstOpen: true, // 第一次打开
      record: [], // 浏览记录
      activate: '/', // 当前路径
      animation: false, // 是否动画
      lazy: true, // 是否懒加载
      routerState: null // 路由状态
    },
    mutations: {
      SET_IOS_BACK (state, payload) {
        state.iosBack = payload.iosBack
      },
      SET_LOADING_STATUS (state, payload) {
        state.isLoading = payload.isLoading
      },
      SET_DIRECTION (state, payload) {
        state.direction = payload.direction
      },
      SET_FIRST_OPEN (state, payload) {
        state.firstOpen = payload.firstOpen
      },
      SET_RECORD (state, payload) {
        state.record = payload.record
      },
      SET_ACTIVATE (state, payload) {
        state.activate = payload.activate
      },
      SET_SCROLL_TOP (state, payload) {
        for (const key in state.record) {
          if (state.record[key].path === payload.path) {
            state.record[key].scrollTop = payload.scrollTop
            break
          }
        }
      },
      SET_ANIMATION (state, payload) {
        state.animation = payload
      },
      SET_LAZY (state, payload) {
        state.lazy = payload
      },
      SET_ROUTER_STATE (state, payload) {
        state.routerState = payload
      }
    },
    actions: {
      // 判断浏览前进后退
      onHistory (context, payload) {
        return context.dispatch('onHistoryRemove', payload.to.path)
          .then((forward) => {
            // 判断是否根目录
            if (context.state.record.length && (payload.to.path === '/' || payload.to.meta.level === 0)) {
              context.commit('SET_RECORD', { record: [{
                path: payload.to.path,
                scrollTop: 0,
                el: ''
              }] })
            } else if (forward) {
              // 如果执行的是replace则删除上一个页面
              if (context.state.routerState === 'replace') {
                context.state.record.pop()
              // 记录上一个一个最后的样式
              } else if (payload.from.matched.length) {
                let record = context.state.record
                // 拿到最后一个
                record[record.length - 1].el = payload.from.matched[0].instances.default.$el
                context.commit('SET_RECORD', { record: record })
              }
              // 记录新页面
              context.dispatch('onHistoryPush', { record: {
                path: payload.to.path,
                scrollTop: 0,
                el: ''
              } })
            }
            // 判断前进还是后退
            if ((payload.to.meta.level !== undefined) && (payload.from.meta.level !== undefined)) {
              if (payload.to.meta.level > payload.from.meta.level) {
                return Promise.resolve(true)
              } else {
                return Promise.resolve(false)
              }
            }
            return Promise.resolve(forward)
          })
      },
      // 添加一个浏览记录
      onHistoryPush (context, payload) {
        let record = context.state.record.concat()
        record.push(payload.record)
        context.commit('SET_RECORD', { record: record })
      },
      // 删除浏览记录
      onHistoryRemove (context, path) {
        let subscript = ''
        let record = context.state.record.concat()
        // 因为可以跨页面返回
        for (var i in record) {
          if (record[i].path === path) {
            subscript = Number(i) + 1
            break
          }
        }
        if (subscript !== '') {
          record.splice(subscript, record.length - subscript)
          context.commit('SET_RECORD', { record: record })
          return Promise.resolve(false)
        } else {
          return Promise.resolve(true)
        }
      }
    }
  })

  let isPush = false
  let firstOpen = true
  let endTime = Date.now()
  let methods = ['push', 'go', 'replace', 'forward', 'back']

  document.addEventListener('touchend', () => {
    endTime = Date.now()
  })
  methods.forEach(key => {
    let method = router[key].bind(router)
    router[key] = (...args) => {
      store.commit('SET_ROUTER_STATE', key)
      isPush = true
      method.apply(null, args)
    }
  })

  router.beforeEach(function (to, from, next) {
    if (!firstOpen) {
      store.commit('SET_FIRST_OPEN', { firstOpen: false })
    }
    store.commit('SET_LOADING_STATUS', { isLoading: true })
    // 判断是否是ios左滑返回
    if (!isPush && (Date.now() - endTime) < 377) {
      store.commit('SET_IOS_BACK', { iosBack: true })
    } else {
      store.commit('SET_IOS_BACK', { iosBack: false })
    }
    // 记录历史记录
    store.dispatch('onHistory', {
      to: to,
      from: from
    })
      .then((forward) => {
        // 设置转场动画
        if (forward) {
          // 第一个页面取消动画
          if (firstOpen) {
            store.commit('SET_ANIMATION', false)
          } else {
            store.commit('SET_ANIMATION', !(to.meta.animation === false))
          }
          store.commit('SET_DIRECTION', { direction: 'forward' })
        } else {
          store.commit('SET_ANIMATION', !(from.meta.animation === false))
          store.commit('SET_DIRECTION', { direction: 'reverse' })
        }
        next()
      })
  })

  router.afterEach(function (to, from) {
    firstOpen = false
    store.commit('SET_LOADING_STATUS', { isLoading: false })
    setTimeout(() => {
      store.commit('SET_ACTIVATE', { activate: to.path })
      // store.commit('SET_DIRECTION', {direction: ''})
    }, 0)
    if (process.env.NODE_ENV === 'production') {
      // ga && ga('set', 'page', to.fullPath)
      // ga && ga('send', 'pageview')
    }
  })
}
