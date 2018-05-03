import plusReady from '../../libs/plusReady.js'
export default function moveTaskToBack () {
  plusReady(() => {
    let main = window.plus.android.runtimeMainActivity()
    main.moveTaskToBack(false)
  })
}
