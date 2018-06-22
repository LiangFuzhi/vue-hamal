import plusReady from '../../libs/plusReady.js'
import compressImage from './compress-image.js'
import getImgBase64 from './img-base64.js'

var wt = ''
/**
 * [gallery 相冊]
 * @param  {[type]} cb  [ 回调函数]
 * @return {[type]}     [图片路径]
 */
let gallery = {
  pick: function (cb, err, max = 720) {
    plusReady(() => {
      window.plus.gallery.pick(function (src) {
        let type = src.slice(-3).toLowerCase()
        if (type === 'jpg' || type === 'png') {
          wt = window.plus.nativeUI.showWaiting('正在压缩图片...')
          // 压缩图片
          compressImage(max, src, (data) => {
            wt.close()
            cb && cb(data)
          })
        } else {
          getImgBase64(src, (data) => {
            cb && cb(data)
          })
        }
      }, function (e) {
        console.log('取消选择图片')
      }, {filter: 'image', multiple: false})
    })
  }
}
export default gallery
