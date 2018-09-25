<template>
  <div>
    <div class="shopcart">
      <div class="content">
        <div class="content-left" @click="toggleList">
          <div class="logo-wrapper">
            <div class="logo" :class="{highlight:totalCount>0}">
              <i class="icon-shopping_cart" :class="{highlight:totalCount>0}"></i>
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{highlight:totalPrice>0}">￥{{totalPrice}}</div>
          <div class="desc">免配送费</div>
        </div>
        <div class="content-right">
          <div class="pay" :class="payClass" @click="orderdetail()">
            {{payDesc}}
          </div>
        </div>
      </div>
      <div class="ball-container">
        <div v-for="(ball, index) in balls" :key="index">
          <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="emptyCart">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="(food, index) in selectFoods" :key="index">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{(food.price*food.count).toFixed(2)}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food" :seller-id="seller.id"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="listmask" @click="hidelist" v-show="listShow"></div>
    </transition>
    <orderdetail :cartGoods="selectFoods" :from="from" :seller="seller" ref="orderdetail"></orderdetail>
  </div>
</template>

<script>
  import cartcontrol from '../cartcontrol/cartcontrol'
  import {saveToLocal} from '../../common/js/cart'
  import BScroll from 'better-scroll'
  import orderdetail from '../orderdetail/orderdetail'
  // import {getStorageSync} from '../../common/js/base'
  export default {
    components: {
      'cartcontrol': cartcontrol,
      'orderdetail': orderdetail
    },
    props: {
      selectFoods: {
        type: Array,
        default() {
          return []
        }
      },
      seller: {
        type: Object
      }
    },
    data() {
      return {
        // shop: {},
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [],
        fold: true,
        from: 'cart'
      }
    },
    computed: {
      // foodsPrice(price, count) {
      //   let totalPrice = price * count
      //   return totalPrice.toFixed(2)
      // },
      totalPrice() {
        let total = 0
        this.selectFoods.forEach((food) => {
          total += food.price * food.count
        })
        return total.toFixed(2)
      },
      totalCount() {
        let count = 0
        this.selectFoods.forEach((food) => {
          count += food.count
        })
        return count
      },
      payDesc() {
        if (this.seller.status === 0) {
          return '休息中'
        }
        if (this.totalPrice === 0) {
          return `￥${this.seller.start_price}元起送`
        } else if (this.totalPrice < this.seller.start_price) {
          let diff = this.seller.start_price - this.totalPrice
          return `还差￥${diff}元起送`
        } else {
          return '去结算'
        }
      },
      payClass() {
        if (this.seller.status === 0) {
          return 'not-enough'
        }
        if (this.totalPrice < this.seller.start_price) {
          return 'not-enough'
        } else {
          return 'enough'
        }
      },
      listShow() {
        let _this = this
        if (!this.totalCount) {
          _this.fold = true
          return false
        }
        let show = !this.fold
        if (show) {
          this.$nextTick(() => {
            if (!_this.scroll) {
              _this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              })
            } else {
              this.scroll.refresh()
            }
          })
        }
        return show
      }
    },
    created() {
      // if (JSON.stringify(this.seller) === '{}') {
      //   console.log('逻辑上不会走shopcart强制刷新')
      //   this.shopId = getStorageSync('shopId', 0)
      //   this.$axios.get('/wap/location/getshopbyid.html?id=' + this.shopId).then((res) => {
      //     if (res.code === 1) {
      //       this.shop = res.data
      //     } else {
      //       console.log(res)
      //     }
      //   })
      // }
    },
    methods: {
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i]
          if (!ball.show) {
            ball.show = true
            ball.el = el
            this.dropBalls.push(ball)
            return
          }
        }
      },
      orderdetail() {
        // if (!event._constructed) {
        //   return
        // }
        if (this.seller.status === 0 || this.totalPrice < this.seller.start_price) {
          return
        }
        this.$refs.orderdetail.show()
      },
      toggleList() {
        if (!this.totalCount) {
          return
        }
        this.fold = !this.fold
      },
      beforeDrop(el) {
        let count = this.balls.length
        while (count--) {
          let ball = this.balls[count]
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect()
            let x = rect.left - 32
            let y = -(window.innerHeight - rect.top - 22)
            el.style.display = ''
            el.style.webkitTransform = `translate3d(0,${y}px,0)`
            el.style.transform = `translate3d(0,${y}px,0)`
            let inner = el.getElementsByClassName('inner-hook')[0]
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`
            inner.style.transform = `translate3d(${x}px,0,0)`
          }
        }
      },
      dropping(el, done) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)'
          el.style.transform = 'translate3d(0,0,0)'
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = 'translate3d(0,0,0)'
          inner.style.transform = 'translate3d(0,0,0)'
          el.addEventListener('transitionend', done)
        })
      },
      afterDrop(el) {
        let ball = this.dropBalls.shift()
        if (ball) {
          ball.show = false
          el.style.display = 'none'
        }
      },
      emptyCart() {
        this.selectFoods.forEach((food) => {
          food.count = 0
          saveToLocal(this.seller.id, food.id, 'count', 0)
        })
      },
      hidelist() {
        this.fold = true
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  @import "../../common/stylus/icon.styl"

  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 38px
    .content
      display: flex
      background: #141d27
      font-size: 0
      color: rgba(255, 255, 255, 0.4)
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          position: relative
          top: -10px
          margin: 0 8px 0 12px
          width: 46px
          height: 46px
          box-sizing: border-box
          vertical-align: top
          border-radius: 50%
          background: #141d27
          .logo
            width: 36px
            height: 36px
            border-radius: 50%
            text-align: center
            margin: 5px auto 5px auto
            background: #2b343c
            &.highlight
              background: rgb(0, 160, 220)
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: #80858a
              &.highlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 400
            color: #fff
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        // 背景阴影
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          padding-right: 4px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size: 14px
          font-weight: 700
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 4px
          font-size: 10px
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 38px
          line-height: 38px
          text-align: center
          font-size: 14px
          font-weight: 700
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
          transition: all 0.4s linear
    .shopcart-list
      position: absolute
      left: 0
      top: 0
      z-index: -1
      width: 100%
      transform: translate3d(0, -100%, 0)
      &.fold-enter-active, &.fold-leave-active
        transition: all 0.5s
      &.fold-enter, &.fold-leave-active
        transform: translate3d(0, 0, 0)
      .list-header
        height: 36px
        line-height: 36px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)
      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff
        .food
          position: relative
          padding: 10px 0
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height: 20px
            font-size: 12px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 20px
            font-size: 12px
            font-weight: 700
            color: rgb(240, 20, 20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 10px

  .listmask
    position: fixed
    opacity: 1
    top: 0
    left: 0
    height: 100%
    width: 100%
    z-index: 40
    backdrop-filter: blur(10px)
    background: rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s
    &.fade-enter, &.fade-leave-active
      opacity: 0
      background: rgba(7, 17, 27, 0)
</style>
