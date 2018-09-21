/**
* Created by kite on 2018/01/20.
*/
import axios from 'axios'

var baseUrl = require('../../../config/proxy').base_url
// var qs = require('qs')

// 设置判断token
function getResetToken() {
  var headers = {
    headers: {
      'token': '',
      'Content-Type': 'application/x-www-form-urlencoded'
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
  get(path, header) {
    console.log(header)
    if (header === undefined || header === '') {
      header = getResetToken()
    } else {
      header = {
        headers: {
          'token': header.token,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    }
    return axios.get(path, header).then((res) => {
      if (res.data.code === 403) {
        // 用户token过期做的处理
        return
      }
      return res.data
    }).catch((error) => {
      console.log(error)
    })
  },
  post(path, params = {}, header = getResetToken()) {
    if (header === undefined || header === '') {
      header = getResetToken()
    } else {
      header = {
        headers: {
          'token': header.token,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    }
    // if (header.headers && header.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    //   params = qs.stringify(params)
    // }
    return axios.post(path, params, header).then((res) => {
      if (res.data.code === 403) {
        // 用户token过期做的处理
        return
      }
      return res.data
    }).catch((error) => {
      console.log(error)
    })
  }
}
