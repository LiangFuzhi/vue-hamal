import plusReady from '../../libs/plusReady.js'
/**
 * [gallery 相冊]
 * @param  {[type]} cb  [ 回调函数]
 * @return {[type]}     [图片路径]
 */
let gallery = {
  pick: function (cb, err) {
    plusReady(() => {
      window.plus.gallery.pick(function (src) {
        let type = src.slice(-3)
        if (type === 'jpg' || type === 'JPG' || type === 'png' || type === 'PNG') {
          window.plus.zip.compressImage({ // 旋转图片
            src: src,
            dst: '_doc/user/portrait.jpg',
            width: '480px',
            height: 'auto',
            quality: 80,
            overwrite: true
          },
          function (event) {
            cb && cb(event.target.replace('file:///', '/'))
          }, function (error) {
            console.log(error.message)
            err && err(error)
          })
        } else {
          cb && cb(src.replace('file:///', '/'))
        }
      }, function (e) {
        console.log('取消选择图片')
      }, {filter: 'image'})
    })
  }
}
export default gallery
