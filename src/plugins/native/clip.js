import plusReady from '../../libs/plusReady.js'
import os from '../../libs/os.js'
/**
 * [geolocation 剪切板操作]
 * @param  {[type]} cb  [ 回调函数]
 * @return {[string]}   [字符串]
 */
let clip = {
  get: function (cb) {
    plusReady(() => {
      let clipValue
      if (os.android) {
        // android
        var Context = window.plus.android.importClass('android.content.Context')
        var main = window.plus.android.runtimeMainActivity()
        var clip = main.getSystemService(Context.CLIPBOARD_SERVICE)
        clipValue = window.plus.android.invoke(clip, 'getText')
      } else if (os.ios) {
        // ios
        var UIPasteboard = window.plus.ios.importClass('UIPasteboard')
        var generalPasteboard = UIPasteboard.generalPasteboard()
        clipValue = generalPasteboard.valueForPasteboardType('public.utf8-plain-text')
        if (clipValue && (typeof (clipValue) !== 'string')) {
          clipValue = clipValue.toString()
        }
      }
      (clipValue && cb) && cb(clipValue)
    })
  },
  set: function (val, cb) {
    plusReady(() => {
      if (os.android) {
        // android
        var Context = window.plus.android.importClass('android.content.Context')
        var main = window.plus.android.runtimeMainActivity()
        var clip = main.getSystemService(Context.CLIPBOARD_SERVICE)
        window.plus.android.invoke(clip, 'setText', val)
      } else if (os.ios) {
        // ios
        var UIPasteboard = window.plus.ios.importClass('UIPasteboard')
        var generalPasteboard = UIPasteboard.generalPasteboard()
        generalPasteboard.setValueforPasteboardType(val, 'public.utf8-plain-text')
      }
      cb && cb()
    })
  }
}
export default clip
