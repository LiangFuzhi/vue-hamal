import plusReady from '../../libs/plusReady.js'
// import EXIF from '../../libs/exif.js'
import EXIF from 'exif-js'
import os from '../../libs/os.js'
import dateFormat from '../../tools/date/format.js'

let cmr = ''
var wt = ''
/**
   * [camera 扫码]
   * @return {[type]}    [description]
   */
let camera = {
  /**
   * [setScanQrCode 设置扫描二维码]
   * @param {[String]}   id    [页面dom的id]
   * @param {[Boolean]}   flash [是否开启闪光灯]
   * @param {Function} cb    [回调函数]
   */
  captureImage: function (cb, err) {
    plusReady(() => {
      // 获取摄像头管理对象
      cmr = window.plus.camera.getCamera()
      // 进行拍照操作
      cmr.captureImage((path) => {
        wt = window.plus.nativeUI.showWaiting('正在压缩图片...')
        // 将本地URL路径转换成平台绝对路径
        var src = window.plus.io.convertLocalFileSystemURL(path)
        this.compressImage(src, () => {
          wt.close()
          cb && cb(src)
        })
      }, function (error) {
        console.log('失败：' + error.message)
        err && err(error)
      }, {
        filename: `_doc/camera/${dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')}.jpg`,
        index: 1
      })
    })
  },
  /**
   * [cancelScanQrCode 进行拍照操作]
   * @return {[type]} [description]
   */
  close: function () {
    plusReady(() => {
      cmr.stopVideoCapture()
    })
  },
  compressImage: function (src, cb) {
    plusReady(() => {
      var img = new window.Image()
      img.src = src
      img.onerror = function (e) {
        console.log('图片加载失败：' + e)
      }
      img.onload = function () {
        console.log('图片加载成功')
        EXIF.getData(this, function () {
          var Orientation = EXIF.getTag(this, 'Orientation')
          var rotate = 0
          var width = 'auto'
          var height = 'auto'
          var Max = '2000px'
          console.log('旋转方向：' + Orientation)
          if (os.ios) {
            rotate = 0
            switch (Orientation) {
              case 1:
                width = Max
                break // 0°
              case 6:
                height = Max
                break // 顺时针90°
              case 8:
                height = Max
                break // 逆时针90°
              case 3:
                width = Max
                break // 180°
              default:
                this.width / this.height > 1 ? (width = Max) : (height = Max)
                break
            }
          } else if (os.android) {
            switch (Orientation) {
              case 1:
                rotate = 0
                width = Max
                break // 0°
              case 6:
                rotate = 90
                height = Max
                break // 顺时针90°
              case 8:
                rotate = 270
                height = Max
                break // 逆时针90°
              case 3:
                rotate = 180
                width = Max
                break // 180°
              default:
                rotate = 0
                this.width / this.height > 1 ? (width = Max) : (height = Max)
                break
            }
          }
          let path = window.plus.io.convertAbsoluteFileSystem(src)
          window.plus.zip.compressImage({ // 旋转图片
            src: path,
            dst: path,
            width: width,
            height: height,
            quality: 90,
            format: 'jpg',
            rotate: rotate, // 旋转
            overwrite: true
          },
          function (e) {
            cb && cb()
          },
          function (error) {
            console.log(error.message)
          })
        })
      }
    })
  }
}

export default camera
