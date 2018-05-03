// 判断当前系统是否是沉浸式状态，是：返回高度
const immersion = function () {
  // console.log("Immersed-UserAgent: "+navigator.userAgent);
  var immersed = 0
  var ms = (/Html5Plus\/.+\s\(.*(Immersed\/(\d+\.?\d*).*)\)/gi).exec(navigator.userAgent)
  if (ms && ms.length >= 3) { // 当前环境为沉浸式状态栏模式
    immersed = parseFloat(ms[2])// 获取状态栏的高度
  }
  return immersed
}

export default immersion
