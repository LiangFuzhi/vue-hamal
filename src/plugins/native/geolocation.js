import plusReady from '../../libs/plusReady.js'
/**
 * [geolocation 获取当前位置]
 * @param  {[type]} cb  [ 回调函数]
 * @param  {[type]} provider="baidu" [需要使用的的定位提供者，默认百度]
 * @return {[type]}                  [定位信息]
 */
let geolocation = {
  getCurrentPosition: function (cb, provider = 'baidu') {
    plusReady(() => {
      // [coords]: (Coordinates 类型 )地理坐标信息，包括经纬度、海拔、速度等信息
      // [coordsType]: (String 类型 )获取到地理坐标信息的坐标系类型
      // 可取以下坐标系类型： “gps”：表示WGS-84坐标系； “gcj02”：表示国测局经纬度坐标系； “bd09”：表示百度墨卡托坐标系； “bd09ll”：表示百度经纬度坐标系。
      // [timestamp]: (Number 类型 )获取到地理坐标的时间戳信息
      // 时间戳值为从1970年1月1日至今的毫秒数。
      // [address]: (Address 类型 )获取到地理位置对应的地址信息
      // 获取地址信息需要连接到服务器进行解析，所以会消耗更多的资源，如果不需要获取地址信息可通过设置PositionOptions参数的geocode属性值为false避免获取地址信息。 如果没有获取到地址信息则返回undefined。
      // 平台支持
      // Android - 2.3+ (支持): 使用系统定位模块无法获取位置信息。
      // iOS - 5.1+ (支持): 系统定位模块也支持获取位置信息。
      // [addresses]: (String 类型 )获取完整地址描述信息
      // 如果没有获取到地址信息则返回undefined。
      // 平台支持
      // Android - 2.3+ (支持): 使用系统定位模块无法获取位置信息。
      // iOS - 5.1+ (支持): 系统定位模块也支持获取位置信息。
      window.plus.geolocation.getCurrentPosition(({coords, coordsType, timestamp, address, addresses}) => {
        let data = {coords, coordsType, timestamp, address, addresses}
        cb && cb(data)
      }, (e) => {
        window.plus.nativeUI.alert('定位错误: ' + e.message, function () {}, '错误', '确定')
      }, {provider: provider})
    })
  }
}
export default geolocation
