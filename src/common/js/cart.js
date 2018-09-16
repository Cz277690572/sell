export function saveToLocal(shopId, id, key, value) {
  let name = '__cart' + shopId + '__'
  let cart = window.localStorage.getItem(name)
  if (!cart) {
    cart = {}
    cart[id] = {}
  } else {
    cart = JSON.parse(cart)
    if (!cart[id]) {
      cart[id] = {}
    }
  }
  cart[id][key] = value
  window.localStorage.setItem(name, JSON.stringify(cart))
}

export function loadFromLocal(shopId, id, key, def) {
  let name = '__cart' + shopId + '__'
  let cart = window.localStorage.getItem(name)
  if (!cart) {
    return def
  }
  cart = JSON.parse(cart)[id]
  if (!cart) {
    return def
  }
  let ret = cart[key]
  return ret || def
}
