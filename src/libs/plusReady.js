export default function plusReady (event) {
  if (window.plus) {
    event()
  } else {
    document.addEventListener('plusready', event, false)
  }
}
