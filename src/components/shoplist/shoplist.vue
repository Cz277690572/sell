<template>
  <div class="shoplist">
    <div class="title">请选择商家</div>
    <div class="shops" ref="shops">
      <div class="shops-wrapper">
        <div class="shop-item" v-for="(item, index) in shops" :key="index" @click="toShop">
          <div class="shop-left">
            <img width="64px" height="64px" :src="item.avatar">
          </div>
          <div class="shop-right">
            <div class="shop-name">{{item.name}}</div>
            <div class="shop-status">状态: <span class="close" :class="{on:item.status=='营业中'}">{{item.status}}</span>
            </div>
            <div class="shop-desc">说明: {{item.desc}}</div>
            <div class="shop-minPrice">起送价{{item.minPrice}}元 <span class="modifier">|</span> 免配送费</div>
          </div>
        </div>
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
    watch: {
      'shops'() {
        this.$nextTick(() => {
          this._initScroll()
        })
      }
    },
    mounted() {
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
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.shops, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      },
      toShop() {
        this.$router.push({name: 'shop'})
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
      /*color: rgb(0, 160, 220)*/
      color: #fff
      font-size: 16px
      background: rgba(0, 160, 220, 0.8)
      /*border-1px(rgba(1, 17, 27, 0.1))*/
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
</style>
