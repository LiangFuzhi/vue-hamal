import plusReady from '../../libs/plusReady.js'
// 读取base64
function getImgBase64 (src, cb) {
  plusReady(() => {
    window.plus.io.resolveLocalFileSystemURL(src, function (entry) {
      // Read data from file
      var reader = null
      entry.file(function (file) {
        reader = new window.plus.io.FileReader()
        reader.onloadend = function (e) {
          // Get data
          cb && cb(e.target.result)
        }
        reader.readAsDataURL(file)
      }, function (e) {
        console.log(e.message)
      })
    }, function (e) {
      console.log('Resolve file URL failed: ' + e.message)
    })
  })
}

export default getImgBase64
