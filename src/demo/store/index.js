import Vue from 'vue'
import Vuex from 'vuex'
import webConfig from 'src/config/web.config.js'
import encryption from 'src/assets/js/encryption.js'
Vue.use(Vuex)
let setIntervalId = ''
let inLogin = false

const store = new Vuex.Store({
  state: {
    mySelf: '',
    aut: {
      isLogin: false,
      userName: '',
      userPwd: ''
    }
  },
  mutations: {
    updateMySelf (state, payload) {
      state.mySelf = payload.mySelf
    },
    updateAut (state, payload) {
      state.aut = Object.assign({}, state.aut, payload.aut)
    },
    updateIsLogin (state, payload) {
      state.aut.isLogin = payload.isLogin
    }
  },
  actions: {
    onLogin (context, payload) {
      if (inLogin) {
        payload && Vue.$vux.toast.text('别按了，按了也没用')
        return
      } else {
        inLogin = true
      }
      let name = ''
      let pwd = ''
      if (payload) {
        name = payload.name
        pwd = payload.pwd
      } else {
        name = context.state.aut.userName
        pwd = context.state.aut.userPwd
      }
      Vue.http.POST('aut/login', {
        name: name,
        pwd: encryption(pwd),
        type: 'com.firefly.pojo.data.Shop'
      }).then((response) => {
        if (response.data.ret) {
          if (payload) {
            Vue.$vux.toast.show({
              text: '登录成功'
            })
            context.dispatch('getMySelf')
            context.dispatch('onAutHeartBeat')
            context.commit('updateAut', {
              aut: {
                userName: payload.name,
                userPwd: payload.pwd,
                isLogin: true
              }
            })
          }
        } else {
          Vue.$vux.toast.text('账号或密码错误')
        }
        setTimeout(() => {
          inLogin = false
        }, 300)
      }).catch((err) => {
        console.log(err)
        inLogin = false
      })
    },
    onLogout (context) {
      Vue.http.GET('aut/logout', {}).then((response) => {
        if (response.data.ret) {
          Vue.$vux.toast.show({
            text: '退出成功'
          })
          context.commit('updateIsLogin', {
            isLogin: false
          })
          context.commit('updateMySelf', {
            mySelf: ''
          })
          context.dispatch('onSocketClose')
          context.dispatch('onCloseHeartBeat')
          window.location.hash = '/'
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    getMySelf (context) {
      Vue.http.GET('aut/mySelf', {}).then((response) => {
        context.commit('updateMySelf', {
          mySelf: response.data
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    onAutHeartBeat (context) {
      if (setIntervalId) {
        clearInterval(setIntervalId)
        setIntervalId = ''
      }
      setIntervalId = setInterval(() => {
        context.dispatch('getMySelf')
      }, webConfig.heartBeat * 1000)
    },
    onCloseHeartBeat () {
      if (setIntervalId) {
        clearInterval(setIntervalId)
        setIntervalId = ''
      }
    }
  }
})

export default store
