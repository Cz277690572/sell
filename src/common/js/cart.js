// export function saveToLocal(shopId, key, value) {
//   let shop = window.localStorage.__shop__
//
//   if (!shop) {
//     shop = {}
//     shop[shopId] = {}
//   } else {
//     shop = JSON.parse(shop)
//     if (!shop[shopId]) {
//       shop[shopId] = {}
//     }
//   }
//   shop[shopId][key] = value
//   window.localStorage.__shop__ = JSON.stringify(shop)
// }
//
// export function loadFromLocal(shopId, key, def) {
//   let shop = window.localStorage.__shop__
//   if (!shop) {
//     return def
//   }
//   shop = JSON.parse(shop)[shopId]
//   if (!shop) {
//     return def
//   }
//   let ret = shop[key]
//   return ret || def
// }

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
  // console.log(cart)
  if (!cart) {
    return def
  }
  let ret = cart[key]
  return ret || def
}
