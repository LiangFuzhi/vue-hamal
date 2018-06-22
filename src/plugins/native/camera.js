import plusReady from '../../libs/plusReady.js'
import compressImage from './compress-image.js'
import dateFormat from '../../tools/date/format.js'

let cmr = ''
var wt = ''
/**
   * [camera 拍照]
   * @return {[type]}    [description]
   */
let camera = {
  /**
   * [captureImage 拍照]
   */
  captureImage: function (max, cb, err) {
    plusReady(() => {
      // 获取摄像头管理对象
      cmr = window.plus.camera.getCamera()
      // 进行拍照操作
      cmr.captureImage((path) => {
        wt = window.plus.nativeUI.showWaiting('正在压缩图片...')
        // 压缩图片
        compressImage(max, path, (data) => {
          wt.close()
          cb && cb(data)
        })
      }, function (e) {
        console.log('失败：' + e.message)
        err && err(e)
      }, {
        filename: `_doc/camera/${dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')}.jpg`,
        index: 1
      })
    })
  },
  /**
   * [close 结束拍照]
   * @return {[type]} [description]
   */
  close: function () {
    plusReady(() => {
      cmr.stopVideoCapture()
    })
  }
}

export default camera
