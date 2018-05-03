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
isAndroid()
isIos()
export default os
