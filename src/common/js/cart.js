export function saveToLocal(id, key, value) {
  let cart = window.localStorage.__cart__
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
  window.localStorage.__cart__ = JSON.stringify(cart)
}

export function loadFromLocal(id, key, def) {
  let cart = window.localStorage.__cart__
  if (!cart) {
    return def
  }
  cart = JSON.parse(cart)[id]
  // console.log(cart)
  if (!cart) {
    return def
  }
  let ret = cart[key]
  return ret || def
}
