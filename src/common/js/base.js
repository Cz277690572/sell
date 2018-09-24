// 设置浏览器缓存
function setStorageSync(key, value) {
  window.localStorage.setItem(key, value)
}

// 通过key获取浏览器缓存值

function getStorageSync(key, def) {
  let value = window.localStorage.getItem(key)
  if (!value) {
    return def
  }
  let ret = value
  return ret
}

export {
  setStorageSync,
  getStorageSync
}
