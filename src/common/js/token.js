import {Config} from './config'

class Token {
  constructor() {
    // 校验token令牌是否过期,过期更新，有效不作处理
    this.verifyUrl = Config.restUrl + 'wap/token/verify'
    // 获取token令牌
    this.tokenUrl = Config.restUrl + 'wap/token/getToken'
  }

  // 令牌校验方法
  verify() {
    let token = window.localStorage.getItem('token')
    if (!token) {
      this.getTokenFromServer()
    } else {
      this._veirfyFromServer(token)
    }
  }

  // 携带令牌去服务器校验令牌
  _veirfyFromServer(token) {
    let that = this
    let params = {'token': token}
    let url = '/api/seller'
    that.$http.get(url, params)
    .then((res) => {
      if (res.code === 0) {
        that.getTokenFromServer()
      } else {
        console.log('有效token')
      }
    })
    .catch((res) => {
      console.log('token请求失败！服务器级别的错误' + res)
    })
  }

  // 从服务器获取token
  getTokenFromServer(callBack) {
    let that = this
    let params = {'code': '11111111111'}
    let url = that.tokenUrl
    that.$http.get(url, params)
    .then((res) => {
      if (res.code === 1) {
        window.localStorage.setItem('token', res.data.token)
        callBack && callBack(res.data.token)
      } else {
        console.log('获取token失败：' + res.msg)
      }
    })
    .catch((res) => {
      console.log('请求失败！服务器级别的错误')
    })
  }
}

export {Token}
