export default (store, router) => {
  store.registerModule('history', {
    state: {
      isLoading: false, // 是否加载
      direction: 'forward', // 状态
      firstOpen: true, // 第一次打开
      record: [], // 浏览记录
      activate: '/' // 当前路径
    },
    mutations: {
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
      }
    },
    actions: {
      // 判断浏览前进后退
      onHistory (context, payload) {
        return context.dispatch('onHistoryRemove', payload)
          .then((e) => {
            if (e) {
              if (payload.from.matched[1]) {
                let record = context.state.record
                record[record.length - 1].el = payload.from.matched[1].instances.default.$el
                record[record.length - 1].instances = payload.from.matched[1].instances.default
                context.commit('SET_RECORD', {record: record})
              }
              context.dispatch('onHistoryPush', {record: {
                path: payload.to.path,
                el: ''
              }})
              return Promise.resolve(true)
            } else {
              if (payload.from.path === '/') {
                let record = context.state.record
                context.commit('SET_RECORD', {record: record[0]})
              }
              return Promise.resolve(false)
            }
          })
      },
      // 添加一个浏览记录
      onHistoryPush (context, payload) {
        let record = context.state.record.concat()
        record.push(payload.record)
        context.commit('SET_RECORD', {record: record})
      },
      // 删除浏览记录
      onHistoryRemove (context, payload) {
        let subscript = ''
        let record = context.state.record.concat()
        for (var i in record) {
          if (record[i].path === payload.to.path) {
            subscript = Number(i) + 1
            break
          }
        }
        if (subscript !== '') {
          record.splice(subscript, record.length - subscript)
          context.commit('SET_RECORD', {record: record})
          return Promise.resolve(false)
        } else {
          return Promise.resolve(true)
        }
      }
    }
  })

  let firstOpen = true
  //
  router.beforeEach(function (to, from, next) {
    if (!firstOpen) {
      store.commit('SET_FIRST_OPEN', {firstOpen: false})
    }
    firstOpen = false
    store.commit('SET_LOADING_STATUS', {isLoading: true})
    store.dispatch('onHistory', {
      to: to,
      from: from
    })
      .then((e) => {
        if (e) {
          store.commit('SET_DIRECTION', {direction: 'forward'})
        } else {
          store.commit('SET_DIRECTION', {direction: 'reverse'})
        }
        next()
      })
  })

  router.afterEach(function (to, from) {
    store.commit('SET_LOADING_STATUS', {isLoading: false})
    setTimeout(() => {
      store.commit('SET_ACTIVATE', {activate: to.path})
      // store.commit('SET_DIRECTION', {direction: ''})
    }, 0)
    if (process.env.NODE_ENV === 'production') {
      // ga && ga('set', 'page', to.fullPath)
      // ga && ga('send', 'pageview')
    }
  })
}
