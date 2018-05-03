import plusReady from '../../libs/plusReady.js'

let scan = ''
/**
 * [barcode 扫码]
 * @return {[type]}    [description]
 */
let barcode = {
  /**
   * [setScanQrCode 设置扫描二维码]
   * @param {[String]}   id    [页面dom的id]
   * @param {[Boolean]}   flash [是否开启闪光灯]
   * @param {Function} cb    [回调函数]
   */
  scanCode: function (config, flash, cb, err) {
    plusReady(() => {
      scan = new window.plus.barcode.Barcode(config.id, [window.plus.barcode.QR], {
        frameColor: config.frameColor || '#04be02',
        scanbarColor: config.scanbarColor || '#04be02'
        // background: config.background || '#000' // 不能透明
      })
      scan.setFlash(flash)
      // type码的类型
      // result扫描结果
      scan.onmarked = (type, result) => {
        cb && cb(result)
      }
      // 错误回调
      scan.onerror = (error) => {
        console.log('扫一扫错误: ' + error)
        err && err(error)
      }
    })
  },
  /**
   * [startScanQrCode 开始识别二维码]
   * @return {[type]} [description]
   */
  start: function () {
    plusReady(() => {
      scan.start()
    })
  },
  /**
   * [cancelScanQrCode 结束识别二维码]
   * @return {[type]} [description]
   */
  cancel: function () {
    plusReady(() => {
      scan.cancel()
    })
  },
  /**
   * [cancelScanQrCode 关闭扫描二维码]
   * @return {[type]} [description]
   */
  close: function () {
    plusReady(() => {
      scan.close()
    })
  }
}

export default barcode
