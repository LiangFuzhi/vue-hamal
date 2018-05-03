import dateFormat from '../../tools/date/format.js'
if (!window.openDatabase) {
  console.log('浏览器不支持webSql')
}
var db = ''
var log = {
  init: function () {
    return new Promise((resolve, reject) => {
      // 新建数据库
      db = openDatabase('webSql', '1.0', 'web sql', 10 * 1024 * 1024)
      // 事务 新建log表
      db.transaction((context) => {
        context.executeSql('CREATE TABLE IF NOT EXISTS log (error text, time text)')
      }, (err) => {
        reject(err)
      }, () => {
        resolve()
      })
    })
  },
  write: function (error) {
    return new Promise((resolve, reject) => {
      if (db) {
        db.transaction((context) => {
          if (typeof error !== 'string') {
            try {
              error = JSON.stringify(error)
            } catch (e) {

            }
          }
          var time = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
          let data = [error, time]
          context.executeSql('INSERT INTO log (error, time) VALUES (?, ?)', data)
        }, (err) => {
          reject(err)
        }, () => {
          resolve()
        })
      }
    })
  },
  query: function () {
    return new Promise((resolve, reject) => {
      if (db) {
        db.transaction((context) => {
          context.executeSql('SELECT * FROM log', [], (tx, result) => {
            let arr = []
            let json = {}
            for (var i = 0; i < result.rows.length; i++) {
              try {
                json = {
                  [i]: {
                    error: JSON.parse(result.rows.item(i).error),
                    time: result.rows.item(i).time
                  }
                }
              } catch (e) {
                json = {
                  [i]: {
                    error: result.rows.item(i).error,
                    time: result.rows.item(i).time
                  }
                }
              }
              arr.push(json)
            }
            // alert(JSON.stringify(arr,null,2))
            // console.log(result);
            resolve(arr.reverse())
          })
        }, (err) => {
          console.log(err)
          reject(err)
        }, () => {

        })
      }
    })
  },
  empty: function () {
    return new Promise((resolve, reject) => {
      if (db) {
        db.transaction((context) => {
          context.executeSql('DELETE FROM log')
          // context.executeSql('DROP TABLE log');
        }, (err) => {
          reject(err)
        }, () => {
          resolve()
        })
      }
    })
  }
}

export default {
  install (Vue) {
    Vue.prototype.$log = log
    Vue.$log = log
  },
  log: log
}
