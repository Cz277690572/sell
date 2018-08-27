<template>
  <div id="app">
    <div class="shop" ref="shop">
      <div class="shop-wrapper">
        <div class="title">请选择商家</div>
        <router-link to="/shop">
          <div class="shop-item" v-for="(item, index) in shops" :key="index">
          <div class="shop-left">
            <img width="64px" height="64px" :src="item.avatar">
          </div>
          <div class="shop-right">
            <div class="shop-name">{{item.name}}</div>
            <div class="shop-status">状态: {{item.status}}</div>
            <div class="shop-desc">说明: {{item.desc}}</div>
            <div class="shop-minPrice">起送价{{item.minPrice}}元 <span class="modifier">|</span> 免配送费 </div>
          </div>
        </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  const ERR_OK = 0
  export default {
    data() {
      return {
        shops: {}
      }
    },
    created() {
      this.$http.get('/api/shops').then((response) => {
        response = response.body
        if (response.errno === ERR_OK) {
          this.shops = response.data
          this._initScroll()
        }
      })
    },
    methods: {
      _initScroll() {
        this.scroll = new BScroll(this.$refs.shop, {
          click: true
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/index.styl"
  #app
    .shop
      position: absolute
      width: 100%
      top: 0px
      left: 0px
      bottom: 0px
      overflow: hidden
      .shop-wrapper
        .title
          line-height: 32px
          color: red
          font-size: 16px
          padding-left: 9px
          border-1px(rgba(1, 17, 27, 0.1))
        .shop-item
          padding: 9px
          display: flex
          border-1px(rgba(1, 17, 27, 0.1))
          .shop-left
            flex: 0 0 64px
            margin-right: 10px
            img
              border-radius: 4px
          .shop-right
            flex: 1
            line-height: 20px
            color: rgb(147, 153, 159)
            font-size: 10px
            .shop-name
              color: rgb(7, 17, 27)
              font-size: 14px
              font-weight: bold
            .shop-minPrice
              .modifier
                color: rgba(1, 17, 27, 0.3)
</style>
