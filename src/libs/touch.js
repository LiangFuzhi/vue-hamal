/*
 * @Author: LFZ
 * @Date: 2018-09-27 11:36:25
 * @Last Modified by: LFZ
 * @Last Modified time: 2018-09-27 14:33:41
 * @Description: 识别触控角度、方向、距离
 */
function touch ({el, direction, touchstart, touchmove, touchend, panstart, panmove, panend}) {
  let startX = 0
  let startY = 0
  let isPan = false
  // let moveX = 0
  // let moveY = 0
  el.addEventListener('touchstart', (event) => {
    let touch = event.touches[0]
    startX = touch.pageX
    startY = touch.pageY
    touchstart && touchstart(event)
  }, false)
  el.addEventListener('touchmove', (event) => {
    let touch = event.changedTouches[0]
    if (!isPan) {
      isPan = true
      let direction = 0
      let angle = Math.atan2(touch.pageY - startY, touch.pageX - startX) * 180 / Math.PI
      event.angle = angle
      if (angle < 45 && angle >= -45) {
        direction = 4
      // alert('右滑动')
      } else if (angle < 135 && angle >= 45) {
        direction = 16
      // alert('下滑动')
      } else if ((angle <= 180 && angle >= 135) || (angle >= -180 && angle < -135)) {
        direction = 2
      // alert('左滑动')
      } else if (angle <= -45 && angle >= -135) {
        direction = 8
      // alert('上滑动')
      }
      event.direction = direction
      panstart && panstart(event)
      // console.log(angle, direction)
      // console.log(getDistance(touch.pageX, touch.pageY, startX, startY))
    } else {
      panmove && panmove(event)
    }
    touchmove && touchmove(event)
  }, false)
  el.addEventListener('touchend', (event) => {
    isPan = false
    touchend && touchend(event)
  }, false)
}

export function getDistance (x1, y1, x2, y2) {
  var _x = Math.abs(x1 - x2)
  var _y = Math.abs(y1 - y2)
  return Math.sqrt(_x * _x + _y * _y)
}
export default touch
