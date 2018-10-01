<template>
  <div class="shoplist">
    <div v-if="showShops" class="title">请选择商家</div>
    <div v-if="showShops" class="shops" ref="shops">
      <div class="shops-wrapper">
        <div class="shop-item" v-for="(item, index) in shops" :key="index" @click="selectShop(item,$event)">
          <div class="shop-left">
            <img width="64px" height="64px" :src="item.logo">
          </div>
          <div class="shop-right">
            <div class="shop-name">{{item.title}}</div>
            <div class="shop-status">状态: <span class="close" :class="{on:item.status=='营业中'}">{{item.status}}</span>
            </div>
            <div class="shop-desc">说明: {{item.desc}}</div>
            <div class="shop-minPrice">起送价{{item.start_price}}元 <span class="modifier">|</span> 免配送费</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!showShops" class="no-shops">
      <!--<span>商家还未入驻，敬请期待！</span>-->
        <span>{{shopDesc}}</span>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  export default {
    data() {
      return {
        showShops: true,
        shopDesc: '',
        shops: {},
        selectedShop: {},
        token: null
      }
    },
    created() {
        this.$axios.get('/wap/location/getshops').then((res) => {
          if (res.code === 1) {
            this.shops = res.data
            this._initScroll()
          } else {
            this.showShops = false
          }
        })
    },
    watch: {
      'shops'() {
        this.$nextTick(() => {
          this._initScroll()
        })
      }
    },
    methods: {
      _initScroll() {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.shops, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      },
      selectShop(shop, event) {
        if (!event._constructed) {
          return
        }
        this.$emit('goShop', shop)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/index.styl"
  .shoplist
    .title
      padding-left: 9px
      line-height: 46px
      color: #fff
      font-size: 16px
      background: rgba(0, 160, 220, 0.8)
    .shops
      position: absolute
      width: 100%
      top: 46px
      left: 0
      bottom: 9px
      overflow: hidden
      .shops-wrapper
        .shop-item
          padding: 9px
          display: flex
          border-1px(rgba(1, 17, 27, 0.1))
          &:last-child
            border-none()
            padding-bottom: 0
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
            .shop-status
              .close
                color: red
                &.on
                  color: #00b43c
            .shop-minPrice
              .modifier
                color: rgba(1, 17, 27, 0.3)
    .no-shops
      position: absolute
      width: 100%
      top: 100px
      left: 0
      bottom: 9px
      font-size: 18px
      text-align: center
</style>
