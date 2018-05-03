import plusReady from '../../libs/plusReady.js'
let push = {
  createMessage: function (option) {
    plusReady(() => {
      let parameter = {
        content: '',
        payload: '',
        option: {
          cover: true
        }
      }
      option = Object.assign({}, parameter, option)
      window.plus.push.createMessage(option.content, option.payload, option.options)
    })
  },
  pushCallback: function (cb) {
    plusReady(() => {
      window.plus.push.addEventListener('click', (msg) => {
        cb(msg)
      }, false)
    })
  }
}
export default push
