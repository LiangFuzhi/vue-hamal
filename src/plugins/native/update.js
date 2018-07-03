/**
 * 判断应用升级模块，从url地址下载升级描述文件到本地local路径
 * yanyilin@dcloud.io
 *
 * 升级文件为JSON格式数据，如下：
{
    "appid":"HelloH5",
    "iOS":{
        "version":"iOS新版本号，如：1.0.0",
        "note":"iOS新版本描述信息，多行使用\n分割",
        "url":"Appstore路径，如：itms-apps://itunes.apple.com/cn/app/hello-h5+/id682211190?l=zh&mt=8"
    },
    "Android":{
        "version":"Android新版本号，如：1.0.1",
        "note":"Android新版本描述信息，多行使用\n分割",
        "url":"apk文件下载地址，如：http://www.dcloud.io/helloh5p/HelloH5.apk"
    }
}
 *
 */

import plusReady from '../../libs/plusReady.js'
var server = '' // 获取升级描述文件服务器地址

/**
 * 检测程序升级
 */
function checkUpdate () {
  getUpdateData((data) => {
    checkUpdateData(data)
  })
}

/**
 * 检查升级数据
 */
function checkUpdateData (j) {
  window.plus.runtime.getProperty(window.plus.runtime.appid, (info) => {
    var curVer = info.version
    var inf = j[window.plus.os.name]
    if (inf) {
      var srvVer = inf.version
      // 判断是否需要升级
      if (compareVersion(curVer, srvVer)) {
        // 提示用户是否升级
        window.plus.nativeUI.confirm(inf.note, function (i) {
          if (i.index === 0) {
            // window.plus.runtime.openURL( inf.url );
            downWgt(inf.url)
          } else {}
        }, inf.title, ['立即更新', '取消'])
      }
    }
  })
}

/**
 * 从服务器获取升级数据
 */
function getUpdateData (cb) {
  var xhr = new window.plus.net.XMLHttpRequest()
  xhr.onreadystatechange = () => {
    switch (xhr.readyState) {
      case 4:
        if (xhr.status === 200) {
          var str = xhr.responseText
          str = str.substr(str.indexOf('{'))
          var data = JSON.parse(str)
          cb(data)
        } else {
          console.log('获取升级数据，联网请求失败：' + xhr.status)
        }
        break
      default:
        break
    }
  }
  xhr.open('GET', server)
  xhr.send()
}

/**
 * 比较版本大小，如果新版本nv大于旧版本ov则返回true，否则返回false
 * @param {String} ov
 * @param {String} nv
 * @return {Boolean}
 */
function compareVersion (ov, nv) {
  if (!ov || !nv || ov === '' || nv === '') {
    return false
  }
  //   var b = false
  var ova = ov.split('.', 4)
  var nva = nv.split('.', 4)
  for (var i = 0; i < ova.length && i < nva.length; i++) {
    var so = ova[i]
    var no = parseInt(so)
    var sn = nva[i]
    var nn = parseInt(sn)
    if (nn > no || sn.length > so.length) {
      return true
    } else if (nn < no) {
      return false
    }
  }
  if (nva.length > ova.length && nv.indexOf(ov) === 0) {
    return true
  }
}

// 资源升级包下载
function downWgt (wgtUrl) {
  window.plus.nativeUI.showWaiting('正在更新,请稍候...')
  window.plus.downloader.createDownload(wgtUrl, {
    filename: '_doc/update/'
  }, function (d, status) {
    if (status === 200) {
      console.log('更新成功：' + d.filename)
      installWgt(d.filename) // 安装wgt包
    } else {
      console.log('更新失败！')
      window.plus.nativeUI.alert('更新失败！')
    }
    window.plus.nativeUI.closeWaiting()
  }).start()
}
// 更新应用资源
function installWgt (path) {
  window.plus.nativeUI.showWaiting('安装更新...')
  window.plus.runtime.install(path, {}, function () {
    window.plus.nativeUI.closeWaiting()
    console.log('安装更新成功！')
    window.plus.nativeUI.alert('更新完成！', function () {
      window.plus.runtime.restart()
    })
  }, function (e) {
    window.plus.nativeUI.closeWaiting()
    console.log('安装更新失败[' + e.code + ']：' + e.message)
    window.plus.nativeUI.alert('安装更新失败[' + e.code + ']：' + e.message)
  })
}

export default function update (url) {
  plusReady(() => {
    if (url) {
      server = url + '?time=' + new Date().getTime()
      checkUpdate()
    }
  })
}
