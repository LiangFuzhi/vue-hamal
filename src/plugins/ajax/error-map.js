/*
 * @Author: zero(504715341@qq.com)
 * @Date: 2017-10-31 14:52:13
 * @Last Modified by: LFZ
 * @Last Modified time: 2018-03-08 15:42:26
 * @description:
 *    错误代码 英->中 映射，用于全局ajax
 */

const errMsg = {
  'timeout of * exceeded': '服务响应超时!',
  'Network Error': '服务无响应!',
  'LoginFailure': '账号或密码错误!',
  'NoLogin': '登录超时,请重新登录!',
  'PhoneNumVerifyCodeIsNotFound': '验证码失效，请重新获取！',
  'VerifyCodeIsNullException': '请输入验证码！',
  'VerifyCodeErr': '同一号码验证码提交过快!',
  'NotIsAdminException': '您不是管理员，不能进行此操作！',
  'VerificationCodeError': '验证码错误'
}
// 如接口没有返回错误值则使用http原生错误
const getErrorMsg = function (error) {
  let msg = ''
  if (error.response) {
    if (error.response.data.msg) {
      msg = error.response.data.msg
    } else {
      msg = error.response.data
    }
  } else {
    msg = error
  }
  return msg
}

// 转换到中文错误
const errorMap = function (error) {
  for (let key in errMsg) {
    if (new RegExp(key).test(getErrorMsg(error))) {
      return errMsg[key]
    }
  }
  return error
}

export {
  errorMap,
  getErrorMsg
}
