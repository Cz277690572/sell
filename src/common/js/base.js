import {Config} from './config'
// import {Token} from './token'
import axios from 'axios'
class Base {
  constructor() {
    this.baseRequestUrl = Config.restUrl
  }
  // 当noRefetch为true时， 不做未授权重试机制
  request(params, noRefetch = false) {
    let that = this
    let url = that.baseRequestUrl + params.url
    let token = '1111111111111'
    axios({
      headers: {
        'token': token
      },
      method: params.type,
      url: url,
      data: params.data
    })
      .then(function (res) {
        console.log('base请求成功' + res)
      })
      .catch((res) => {
        console.log('base请求失败！服务器级别的错误:' + res)
      })
    // if (params.type === 'GET') { // 走get请求方式
    //   console.log('走get请求方式')
    //   // console.log(this.$http)
    //   that.$http.get(url, params.data, {
    //     headers: {
    //       'token': 'f39f830f357f2e5f6cc30531a7a46e46'
    //     }
    //   })
    //   .then((res) => {
    //     if (res.code === 1) { // 请求数据成功
    //       console.log(res)
    //       params.sCallback && params.sCallback(res)
    //     } else {
    //       if (res.code === 403) { // 403t表示token无效/过期
    //         if (!noRefetch) {
    //           that._refetch(params)
    //         } else {
    //           params.eCallback && params.eCallback(res)
    //         }
    //       }
    //     }
    //   })
    //   .catch((res) => {
    //     console.log('base请求失败！服务器级别的错误:' + res)
    //   })
    // } else { // 走post请求方式
    //   that.$http.post(url, params.data, {
    //     headers: {
    //       'token': 'f39f830f357f2e5f6cc30531a7a46e46'
    //     }
    //   })
    //   .then((res) => {
    //     if (res.code === 1) { // 请求数据成功
    //       console.log(res)
    //       params.sCallback && params.sCallback(res)
    //     } else {
    //       if (res.code === 403) { // 403t表示token无效/过期
    //         if (!noRefetch) {
    //           that._refetch(params)
    //         } else {
    //           params.eCallback && params.eCallback(res)
    //         }
    //       }
    //     }
    //   })
    //   .catch((res) => {
    //     console.log('base请求失败！服务器级别的错误:' + res)
    //   })
    // }
  }

  // _refetch(params) {
  //   let token = new Token()
  //   token.getTokenFromServer((token) => {
  //     this.request(params, true)
  //   })
  // }

  // 设置浏览器缓存
  setStorageSync(key, value) {
    window.localStorage.setItem(key, value)
  }
  // 通过key获取浏览器缓存值
  getStorageSync(key, def) {
    let value = window.localStorage.getItem(key)
    if (!value) {
      return def
    }
    let ret = value
    return ret
  }
}

export {Base}
