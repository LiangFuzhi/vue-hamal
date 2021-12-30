import immersion from './immersion.js'
import os from '../../libs/os.js'
export default (store) => {
  store.registerModule('device', {
    state: {
      os: '',
      version: '',
      navigation: {
        height: 0
      }
    },
    mutations: {
      updateOs (state, payload) {
        state.os = payload.os
      },
      updateNavigation (state, payload) {
        state.navigation = payload.navigation
      },
      updateVersion (state, payload) {
        state.version = payload.version
      }
    },
    actions: {

    }
  })
  let navigation = {
    height: immersion()
    // height:30
  }

  store.commit('updateNavigation', { 'navigation': navigation })
  store.commit('updateOs', { 'os': os })
}
