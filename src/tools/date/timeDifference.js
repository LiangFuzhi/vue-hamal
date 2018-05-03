/**
 * Created by 44853 on 2016/11/16.
 */

/**
 * 计算时间差
 * @param newDate 系统时间
 * @param createDate 创建时间
 * @returns {string}
 */
function difference (newDate, createDate) {
  newDate = newDate.replace(/-/g, '/')
  createDate = createDate.replace(/-/g, '/')
  var diff = new Date(newDate).getTime() - new Date(createDate).getTime()// 时间差的毫秒数

  // 计算出相差天数
  var days = Math.floor(diff / (24 * 3600 * 1000))

  // 计算出小时数
  var leave1 = diff % (24 * 3600 * 1000)    // 计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000))
  // 计算相差分钟数
  var leave2 = leave1 % (3600 * 1000)        // 计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000))

  // 计算相差秒数
  var leave3 = leave2 % (60 * 1000)      // 计算分钟数后剩余的毫秒数
  var seconds = Math.round(leave3 / 1000)
  // console.log(newDate);
  // console.log(createDate);
  // console.log(diff);
  // console.log(days);
  // console.log(leave1);
  // console.log(leave2);
  // console.log(leave3);
  // console.log(seconds);
  var returnStr = seconds + '秒'
  if (minutes > 0) {
    returnStr = minutes + '分'
  }
  if (hours > 0) {
    returnStr = hours + '小时'
  }
  if (days > 0) {
    returnStr = days + '天'
  }
  return returnStr + '前'
}

export default difference
