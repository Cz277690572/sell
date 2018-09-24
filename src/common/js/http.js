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
        console.log('get请求，token失效，重新获取token')
        console.log(wxLoginUrl)
        window.localStorage.setItem('token', '')
        window.location.href = wxLoginUrl
        // https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx27426b7ce34961cf&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F%23%2Fshoplist&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect
        // 用户token过期做的处理
        // axios.get('/wap/token/getToken?code=111111').then((res) => {
        //     if (res.data.code === 1) {
        //       console.log('token失效，重新获取token成功')
        //       window.localStorage.setItem('token', res.data.data.token)
        //       header = getResetToken()
        //       axios.get(path, header).then((res) => {
        //         if (res.data.code === 403) {
        //           console.log(res)
        //         } else {
        //           return res.data
        //         }
        //       })
        //     } else {
        //       console.log('token失效，重新获取token失败')
        //       console.log(res)
        //     }
        // }).catch((error) => {
        //   console.log('重新获取token请求失败' + error)
        // })
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
        // 用户token过期做的处理
        // axios.get('/wap/token/getToken?code=111111').then((res) => {
        //   if (res.data.code === 1) {
        //     console.log('token失效，重新获取token成功')
        //     window.localStorage.setItem('token', res.data.data.token)
        //     header = getResetToken()
        //     axios.post(path, params, header).then((res) => {
        //       if (res.data.code === 403) {
        //         console.log(res)
        //       } else {
        //         return res.data
        //       }
        //     })
        //   } else {
        //     console.log('token失效，重新获取token失败')
        //     console.log(res)
        //   }
        // }).catch((error) => {
        //   console.log('重新获取token请求失败' + error)
        // })
        console.log('post请求，token失效，重新获取token')
        window.localStorage.setItem('token', '')
        window.location.href = wxLoginUrl
      }
      return res.data
    }).catch((error) => {
      console.log(error)
    })
  }
}
