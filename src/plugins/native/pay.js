import Vue from 'vue'
import plusReady from '../../libs/plusReady.js'
let pays = {} // 当前手机支持的支付方式
let pay = {
  /**
   * [payment 发起付款]
   * @param  {String}   channel [支付方式]
   * @param  {String}   order [订单]
   * @param  {Function} cb      [成功回调]
   * @param  {Function}   err     [错误回调]
   * @return {[type]}           [description]
   */
  payment: function (channel, order, cb, err) {
    plusReady(() => {
      if (pays[channel]) {
        window.plus.payment.request(pays[channel], order, function (result) {
          // alert(JSON.stringify(result));
          cb && cb(result)
        }, function (e) {
          if (e.message.indexOf('6001') > -1 || e.message.indexOf('62001') > -1 || e.message.indexOf('-2') > -1) {
            Vue.$vux.toast.text(`用户取消支付`)
          } else {
            Vue.$vux.toast.text(`${e.message}`)
          }
          // alert(`[${e.code}]：${e.message}`);
          console.log(`[${e.code}]：${e.message}`)
          err && err(e)
        })
      } else {
        console.log('不支持的支付方式:' + channel)
      }
    })
  },
  /**
   * [getChannels 获取本机支持的支付方式]
   * @param  {Function} cb      [成功回调]
   * @param  {Function}   err     [错误回调]
   * @return {[type]}           [description]
   */
  getChannels: function (cb, err) {
    plusReady(() => {
      window.plus.payment.getChannels(function (channels) {
        for (var i in channels) {
          var channel = channels[i]
          // 过滤掉不支持的支付通道：暂不支持360相关支付
          if (channel.id === 'qhpay' || channel.id === 'qihoo') {
            continue
          }
          pays[channel.id] = channel
        }
        cb(pays)
      }, function (e) {
        console.log(`获取支付通道失败：${e.message}`)
        err && err(e)
      })
    })
  }
}
export default pay
