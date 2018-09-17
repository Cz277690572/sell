// import {Config} from 'config'
// import {Token} from 'Token'

class Base {
  // constructor() {
  // this.baseRequestUrl = Config.restUrl
  // }

  // 当noRefetch为true时， 不做未授权重试机制
  // request(params, noRefetch) {
  //   let that = this
  //   let url = that.baseRequestUrl + params.url
  //   if (!params.type) { // 走get请走方式
  //     console.log('走get请走方式')
  //     return false
  //     that.$http.get(url, params.data, {
  //       headers: {
  //         'token': 'bbb08084bf87aaa703ebe89e4c49af6c'
  //       }
  //     })
  //       .then((res) => {
  //         if (res.code === 1) { // 获取数据成功
  //           console.log(res)
  //         } else {
  //           // if (res.code === 403) {
  //           //   if (!noRefetch) {
  //           //     that._refetch(params)
  //           //   } else {
  //           //     params.eCallback && params.eCallback(res.data)
  //           //   }
  //           // }
  //         }
  //       })
  //       .catch((res) => {
  //         console.log('base请求失败！服务器级别的错误:' + res)
  //       })
  //   } else { // 走post请走方式
  //     that.$http.post(url, params.data)
  //       .then((res) => {
  //         if (res.code === 0) {
  //           that.getTokenFromServer()
  //         }
  //       })
  //       .catch((message) => {
  //         console.log('base请求失败！服务器级别的错误')
  //       })
  //   }
  // }

  // _refetch(params) {
  //   let token = new Token()
  //   token.getTokenFromServer((token) => {
  //     this.request(params, true)
  //   })
  // }
  echo(str) {
    console.log(str)
  }
  setStorageSync(key, value) {
    window.localStorage.setItem(key, value)
  }

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
