<template>
  <div class="order" ref="order">
    <div class="order-wrapper">
      <div class="order-item" v-for="(item, index) in orders" :key="index" @click="orderdetail(item.id, $event)">
        <div class="order-header">
          <span>订单编号:</span><span class="order-no">{{item.order_no}}</span>
        </div>
        <div class="order-main">
          <div class="order-left">
            <img width="57px" height="57px"
                 src="http://fuss10.elemecdn.com/8/71/c5cf5715740998d5040dda6e66abfjpeg.jpeg?imageView2/1/w/180/h/180">
          </div>
          <div class="order-middle">
            <div class="order-desc">{{item.desc}}</div>
            <div class="order-count">{{item.count}}件商品</div>
          </div>
          <div class="order-right">
            <span v-show="item.status == '待付款'" class="order-status unpay">{{item.status}}</span>
            <span v-show="item.status == '已付款'" class="order-status payed">等待商家发货</span>
            <span v-show="item.status == '已发货'" class="order-status done">已发货</span>
          </div>
        </div>
        <div class="order-bottom">
          <div class="desc">实付￥{{item.pay}}元</div>
          <div class="pay" v-show="item.status == '待付款'">付款</div>
          <div class="confirm" v-show="item.status == '已发货'">确认收货</div>
          <div class="complete" v-show="item.status == '订单已完成' || item.status == '已收货'">订单已完成</div>
          <div class="shut" v-show="item.status == '订单已失效'">订单已失效</div>
        </div>
        <div class="split"></div>
      </div>
    </div>
    <orderdetail v-if="_checkShop(shop)" :orderId="orderId" :from="from" :seller="shop" :sellerStatus="seller.status" :minPrice="seller.minPrice" v-on:loadorder="_loadData" ref="orderdetail"></orderdetail>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import orderdetail from '../orderdetail/orderdetail'
  import {Base} from '../../common/js/base'
  const ERR_OK = 0
  export default {
    components: {
      'orderdetail': orderdetail
    },
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        shop: {},
        orders: [],
        from: 'order',
        orderId: 0
      }
    },
    created() {
      // 判断缓父组件是否传来this.seller
      // 是不做处理
      // 不是读取缓存中的shopId
      if (JSON.stringify(this.seller) === '{}') {
        console.log('orders强制刷新')
        this.shopId = (new Base()).getStorageSync('shopId', 0)
        this.$http.get('/api/seller').then((response) => {
          response = response.body
          if (response.errno === ERR_OK) {
            this.shop = response.data
            this._loadData()
          }
        })
      } else {
        console.log('orders不是强制刷新')
        this.shop = this.seller
        this._loadData()
      }
    },
    methods: {
      _checkShop(Obj) {
        if (JSON.stringify(Obj) === '{}') {
          return false
        } else {
          return true
        }
      },
      _loadData() {
        this.$http.get('/api/orders').then((response) => {
          response = response.body
          if (response.errno === ERR_OK) {
            this.orders = response.data
            console.log(this.orders)
            this.$nextTick(() => {
              this._initScroll()
            })
          }
        })
      },
      _initScroll() {
        this.scroll = new BScroll(this.$refs.order, {
          click: true
        })
      },
      orderdetail(id, event) {
        if (!event._constructed) {
          return
        }
        console.log(id)
        this.orderId = id
        this.$refs.orderdetail.show()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .order
    position: absolute
    top: 174px
    left: 0
    bottom: 0
    width: 100%
    overflow: hidden
    .order-item
      .order-header
        padding: 18px 18px 5px 18px
        line-height: 14px
        color: rgb(147, 153, 159)
        font-size: 14px
        .order-no
          margin-left: 8px
      .order-main
        display: flex
        padding: 5px 0
        margin: 0 18px
        border-top: 1px solid #EDEDED
        border-bottom: 1px solid #EDEDED
        .order-left
          display: inline-block
          vertical-align: top
          img
            flex: 0 0 57px
            margin-right: 10px
        .order-middle
          flex: 1
          .order-desc, .order-count
            margin: 10px 0
            color: rgb(147, 153, 159)
            font-size: 10px
        .order-right
          flex: 1
          margin: 19px 0
          text-align: right
          .order-status
            font-size: 10px
          .unpay
            color: #B42F2D
          .payed
            color: #DDB477
          .done
            color: #57AB53
      .order-bottom
        display: flex
        padding-top: 5px
        margin: 0 18px 9px 18px
        .desc
          flex: 1
          line-height: 28px
          font-size: 14px
          color: rgb(7, 17, 27)
        .pay, .confirm, .complete, .shut
          flex: 0 0 70px
          height: 28px
          line-height: 28px
          color: #fff
          font-size: 14px
          text-align: center
        .pay
          background-color: #B42F2D
          border-radius: 4px
        .confirm
          background-color: #00b43c
          border-radius: 4px
      .split
        width: 100%
        height: 8px
        background: #f3f5f7
</style>
