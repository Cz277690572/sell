/**
* Created by kite on 2018/01/20.
*/
import axios from 'axios'

var baseUrl = require('../../../config/proxy').base_url
var appid = 'wx728574657c58a57e'
var scope = 'snsapi_userinfo'
var redirectUri = 'http://www.xialangschool.cn/wap/token/getToken.html'
var wxLoginUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?' + 'appid=' + appid + '&redirect_uri=' + redirectUri + '&response_type=code&scope=' + scope + '&state=null#wechat_redirect'

// 设置判断token
function getResetToken() {
  var headers = {
    headers: {
      'token': window.localStorage.getItem('token'),
      // 'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Type': 'application/json;charset=utf-8'
    }
  }
  return headers
}
axios.defaults.baseURL = baseUrl

 export default {
  /**
   * get 请求
   * @param {*} path
   * @param {*} header
   */
  get(path) {
    var header = getResetToken()
    return axios.get(path, header).then((res) => {
      if (res.data.code === 403) {
        window.localStorage.setItem('token', '')
        window.location.href = wxLoginUrl
      }
      return res.data
    }).catch((error) => {
      console.log(error)
    })
  },
  post(path, params) {
    var header = getResetToken()
    return axios.post(path, params, header).then((res) => {
      if (res.data.code === 403) {
        window.localStorage.setItem('token', '')
        window.location.href = wxLoginUrl
      }
      return res.data
    }).catch((error) => {
      console.log(error)
    })
  }
}
