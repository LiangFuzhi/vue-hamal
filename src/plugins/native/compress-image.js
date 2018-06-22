import plusReady from '../../libs/plusReady.js'
import EXIF from 'exif-js'
import os from '../../libs/os.js'
import getImgBase64 from './img-base64.js'

// 压缩图片
function compressImage (max = '2000', src, cb) {
  plusReady(() => {
    getImgBase64(src, (data) => {
      let img = {
        src: data
      }
      EXIF.getData(img, function () {
        var Orientation = EXIF.getTag(this, 'Orientation')
        var rotate = 0
        var width = 'auto'
        var height = 'auto'
        var Max = max + 'px'
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
        window.plus.zip.compressImage({ // 旋转图片
          src: src,
          dst: src,
          width: width,
          height: height,
          quality: 90,
          format: 'jpg',
          rotate: rotate, // 旋转
          overwrite: true
        },
        function (event) {
          getImgBase64(event.target, (base64) => {
            let data = {
              src: `file://${event.target.replace}`,
              base64: base64
            }
            cb && cb(data)
          })
        },
        function (error) {
          console.log(error.message)
        })
      })
    })
  })
}

export default compressImage
