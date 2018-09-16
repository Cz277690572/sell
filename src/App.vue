<template>
  <div id="app">
    <shopList v-if="!isShowShop" @goShop="shopShow"></shopList>
    <shop v-if="isShowShop" :shop="shop"></shop>
  </div>
</template>

<script>
  import shop from './components/shop/shop'
  import shopList from './components/shoplist/shoplist'

  export default {
    components: {
      'shop': shop,
      'shopList': shopList
    },
    data() {
      return {
        shop: {},
        isShowShop: false,
        thisUrl: '/'
      }
    },
    watch: {
      $route(to, from) {
        const thisUrl = this.$route.path
        console.log(thisUrl)
        if (thisUrl === '/goods') {
          this.isShowShop = true
        } else if (thisUrl === '/orders') {
          this.isShowShop = true
        } else if (thisUrl === '/seller') {
          this.isShowShop = true
        } else {
          this.isShowShop = false
        }
      }
    },
    beforeMount() {
      const thisUrl = this.$route.path
      console.log(thisUrl)
      if (thisUrl === '/goods') {
        this.isShowShop = true
        this.$router.push({path: '/goods'})
      } else if (thisUrl === '/orders') {
        this.isShowShop = true
        this.$router.push({path: '/orders'})
      } else if (thisUrl === '/seller') {
        this.isShowShop = true
        this.$router.push({path: '/seller'})
      } else {
        this.isShowShop = false
      }
    },
    created() {
    },
    methods: {
      shopShow(seller) {
        this.shop = seller
        this.$router.push({path: '/goods'})
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
