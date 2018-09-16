import Config from './config.js'

export function EchoUrl() {
  console.log(Config.wxLoginUrl)
}

export function setStorageSync(key, value) {
  window.localStorage.setItem(key, value)
}

export function getStorageSync(key, def) {
  let value = window.localStorage.getItem(key)
  if (!value) {
    return def
  }
  let ret = value
  return ret
}
