import plusReady from '../../libs/plusReady.js'
import Promise from 'bluebird'
let wt = ''
let upload = {
  /**
   * [upload 上传文件]
   * @param  {[string]}   server [上传文件服务器地址]
   * @param  {[string]}   path   [本地文件地址]
   * @param  {[string]}   showWaiting   [显示等待窗]
   * @param  {[string]}   closeWaiting   [关闭等待窗]
   * @return {[obj]}          [Promise]
   */
  upload: function (server, path, num = '1/1', showWaiting = true, closeWaiting = true) {
    return new Promise((resolve, reject) => {
      plusReady(() => {
        path = window.plus.io.convertAbsoluteFileSystem(path)
        if (showWaiting) {
          wt = window.plus.nativeUI.showWaiting('开始上传...')
        }
        var task = window.plus.uploader.createUpload(server, {
          method: 'POST',
          timeout: 10,
          retry: 0
        }, (data, status) => { // 上传完成
          closeWaiting && wt.close()
          if (status === 200) {
            var state = JSON.parse(data.responseText)
            var ret = state.ret || state.err
            console.log('上传状态：' + ret)
            task.abort() // 取消上传任务
            resolve(state)
          } else {
            console.log('上传失败：' + data.responseText + '|' + status)
            reject(data)
          }
        })
        task.addFile(path, {
          key: 'file.uploadFile'
        })
        task.addEventListener('statechanged', onStateChanged, false)
        task.start()
        // 监听上传任务状态
        var i = 0
        var progress = 0

        function onStateChanged (upload, status) {
          if (status !== 200) {
            progress = Math.round(upload.uploadedSize / upload.totalSize * 100)
            if (progress - i >= 5) {
              i += progress - i
              if (progress === 100) {
                progress = 99.9
              }
              wt.setTitle(`${num}上传中...${progress}%`)
            }
          } else if (status === 200) {
            wt.setTitle(`${num}上传中...100%`)
          }
        }
      })
    })
  },
  /**
   * [batchUpload 批量上传文件]
   * @param  {[string]}   server [上传文件服务器地址]
   * @param  {[array]}   pathArray   [本地文件地址数组]
   * @return {[obj]}          [Promise]
   */
  batchUpload: function (server, pathArray) {
    return Promise.reduce(pathArray, (total, fileName, index, length) => {
      if (fileName.src) {
        return this.upload(server, fileName.src, `${index + 1}/${length}`, index === 0, index + 1 === length)
          .then((contents) => {
            total.push(Object.assign({}, pathArray[index], {'id': contents}))
            return total
          })
      } else {
        return total
      }
    }, [])
      .then(function (total) {
        return Promise.resolve(total)
      }).catch((err) => {
        return Promise.reject(err)
      })
  }
}

export default upload
