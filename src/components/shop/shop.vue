<template>
  <div class="shop">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/orders">订单</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <router-view :seller="seller"></router-view>
  </div>
</template>

<script>
  import header from '../header/header.vue'
  import {setStorageSync, getStorageSync} from '../../common/js/base'
  const ERR_OK = 0
  export default {
    props: {
      shop: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        seller: {},
        shopId: 0
      }
    },
    created() {
      // 判断缓父组件是否传来this.shop
      // 是重置this.shop.id
      // 不是读取缓存中的this.shop.id
      if (JSON.stringify(this.shop) !== '{}') {
        this.shopId = this.shop.id
        setStorageSync('shopId', this.shopId)
        console.log('shop不是强制刷新,设置缓存')
        this.$http.get('/api/seller').then((response) => {
          response = response.body
          if (response.errno === ERR_OK) {
            this.seller = response.data
          }
        })
      } else {
        this.shopId = getStorageSync('shopId', 0)
        console.log('shop强制刷新,读取缓存')
        this.$http.get('/api/seller').then((response) => {
          response = response.body
          if (response.errno === ERR_OK) {
            this.seller = response.data
          }
        })
      }
    },
    components: {
      'v-header': header
    },
    methods: {
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/index.styl"

  .shop
    .tab
      display: flex
      width: 100%
      height: 40px
      line-height: 40px
      border-1px(rgba(1, 17, 27, 0.1))
      .tab-item
        flex: 1
        text-align: center
        & > a
          display: block
          font-size: 14px
          color: rgb(77, 85, 93)
          &.active
            color: rgb(240, 20, 20)
</style>
