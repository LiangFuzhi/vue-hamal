import dateFormat from '../../tools/date/format.js'
import LocalForage from 'localforage'
let localforage
var log = {
  init: function () {
    localforage = LocalForage.createInstance({
      name: 'vue-hamal'
    })
  },
  write: function (error) {
    var time = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
    return localforage.setItem(time, error).then(() => {
      log.completeHook && log.completeHook('write', error)
    }).catch((err) => {
      console.error(err)
      log.failHook && log.failHook('write', err)
    })
  },
  query: function () {
    let list = []
    return localforage.iterate((value, key) => {
      // 此回调函数将对所有 key/value 键值对运行
      list.unshift({
        time: key,
        error: value
      })
    }).then(() => {
      log.completeHook && log.completeHook('query', list)
      return list
    }).catch((err) => {
      console.error(err)
      log.failHook && log.failHook('query', err)
    })
  },
  empty: function () {
    return localforage.clear().then(() => {
      // 当数据库被全部删除后，此处代码运行
      log.completeHook && log.completeHook('empty')
    }).catch((err) => {
      console.error(err)
      log.failHook && log.failHook('empty', err)
    })
  }
}

export default {
  install (Vue) {
    Vue.config.globalProperties.$log = log
    Vue.$log = log
  },
  log: log
}
