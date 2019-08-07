/*
 * @Author: LFZ
 * @Date: 2019-04-17 18:15:21
 * @Last Modified by: LFZ
 * @Last Modified time: 2019-04-30 11:24:32
 * @Description: 系统信息
 */
let os = {}
let ua = navigator.userAgent
function isAndroid () { // android
  var android = ua.match(/(Android);?[\s/]+([\d.]+)?/)
  if (android) {
    os.android = true
    os.version = android[2]

    os.isBadAndroid = !(/Chrome\/\d/.test(window.navigator.appVersion))
  }
}

function isIos () { // ios
  var iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/)
  if (iphone) { // iphone
    os.ios = os.iphone = true
    os.version = iphone[2].replace(/_/g, '.')
  } else {
    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/)
    if (ipad) { // ipad
      os.ios = os.ipad = true
      os.version = ipad[2].replace(/_/g, '.')
    }
  }
}

function isWx () {
  var wx = ua.match(/MicroMessenger/i)
  if (wx) {
    os.wx = true
  } else {
    os.wx = false
  }
}
isAndroid()
isIos()
isWx()
export default os
