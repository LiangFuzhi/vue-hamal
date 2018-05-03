import push from './push.js'
import moveTaskToBack from './moveTaskToBack.js'
import update from './update.js'
import audio from './audio.js'
import pay from './pay.js'
import barcode from './barcode.js'
import camera from './camera.js'
import upload from './upload.js'
import geolocation from './geolocation.js'
import clip from './clip.js'
import gallery from './gallery.js'
let native = {
  'push': push,
  'moveTaskToBack': moveTaskToBack,
  'update': update,
  'audio': audio,
  'pay': pay,
  'barcode': barcode,
  'camera': camera,
  'upload': upload,
  'geolocation': geolocation,
  'clip': clip,
  'gallery': gallery
}

export default {
  install (Vue) {
    Vue.prototype.$native = native
  },
  native: native
}
