/**
 * 格式化ajax发送的参数
 * @param {object} obj 参数对象
 * @returns {object} 排除空字符串
 */
let formatParams = function (obj) {
  let ret = {}
  for (var key in obj) {
    if (obj[key] !== '') {
      ret[key] = obj[key]
    }
  }
  return ret
}

export default {
  formatParams
}
