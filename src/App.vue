<template>
  <div id="app">
    <shoplist v-if="!isShowShop" @goShop="changeShow"></shoplist>
    <shop v-if="isShowShop" :shop="shop"></shop>
  </div>
</template>

<script>
  import shop from './components/shop/shop'
  import shoplist from './components/shoplist/shoplist'

  export default {
    components: {
      'shop': shop,
      'shoplist': shoplist
    },
    data() {
      return {
        isShowShop: false
      }
    },
    watch: {
      $route(to, from) {
        const thisUrl = this.$route.path
        console.log(thisUrl)
        if (thisUrl === '/goods') {
          this.isShowShop = true
        } else if (thisUrl === '/shoplist') {
          this.isShowShop = false
        } else {
          this.isShowShop = true
        }
      }
    },
    created() {
    },
    methods: {
      changeShow(seller) {
        console.log(seller)
        // this.$router.push({path: '/goods'})
        this.$router.push({path: '/goods', query: {shopId: seller.id}})
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
