import webConfig from 'src/config/web.config.js'
let socket = ''
let setIntervalId = ''
export default (store) => {
  store.registerModule('socket', {
    state: {
      isSocket: false,
      msg: '',
      voiceMsg: '',
      aut: ''
    },
    mutations: {
      updateMsg (state, payload) {
        state.msg = payload.msg
      },
      updateVoiceMsg (state, payload) {
        state.voiceMsg = payload.voiceMsg
      },
      updateIsSocket (state, payload) {
        state.isSocket = payload.isSocket
      },
      updateWsAut (state, payload) {
        state.aut = payload.aut
      }
    },
    actions: {
      onSocket (context, payload) {
        context.commit('updateWsAut', {
          aut: payload
        })
        socket = new window.WebSocket(payload.ws)
        socket.onopen = (event) => {
          context.commit('updateIsSocket', {
            isSocket: true
          })
          context.dispatch('onSend', payload.login)
          context.dispatch('onSocketHeartBeat')
        }
        socket.onmessage = (event) => {
          var data = JSON.parse(event.data)
          if (data.type === 'com.firefly.pojo.data.Sell') {
            context.commit('updateMsg', {
              msg: data.data
            })
          } else if (data.type === 'com.firefly.notice.pack.SendVoiceNotice') {
            context.commit('updateVoiceMsg', {
              voiceMsg: data.data
            })
          }
        }
        socket.onerror = (event) => {
          console.error(event)
        }
        socket.onclose = (event) => {
          context.commit('updateIsSocket', {
            isSocket: false
          })
          console.error(event)
          // 异常断开重新连接
          if (event.code === 1006) {
            context.dispatch('onSocket', payload)
          }
        }
      },
      onSend (context, payload) {
        payload = template(payload)
        socket.send(JSON.stringify(payload))
      },
      onSocketHeartBeat (context) {
        if (setIntervalId) {
          clearInterval(setIntervalId)
          setIntervalId = ''
        }
        setIntervalId = setInterval(() => {
          context.dispatch('onSend', {
            'path': '/client/heart',
            'method': 'get'
          })
        }, webConfig.heartBeat * 1000)
      },
      onSocketClose (context) {
        if (setIntervalId) {
          clearInterval(setIntervalId)
          setIntervalId = ''
        }
        socket.close()
      }
    }
  })

  function template (val) {
    var data = {
      'id': '',
      'method': '',
      'path': '',
      'params': ''
    }
    return Object.assign({}, data, val)
  }
}
