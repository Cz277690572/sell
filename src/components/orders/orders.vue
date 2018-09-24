<template>
  <div class="order" ref="order">
    <div v-if="orders.length > 0" class="order-wrapper">
      <div class="order-item" v-for="(item, index) in orders" :key="index">
        <div class="order-header"  @click="_detailShow(item.id, $event)">
          <span>订单编号:</span><span class="order-no">{{item.order_no}}</span>
        </div>
        <div class="order-main"  @click="_detailShow(item.id, $event)">
          <div class="order-left">
            <img width="57px" height="57px"
                 :src="item.order_logo">
          </div>
          <div class="order-middle">
            <div class="order-desc">{{item.order_title}}</div>
            <div class="order-count">{{item.goods_count}}件商品</div>
          </div>
          <div class="order-right">
            <span v-show="item.status == '未支付'" class="order-status unpay">{{item.status}}</span>
            <span v-show="item.status == '已付款'" class="order-status payed">等待商家发货</span>
            <span v-show="item.status == '已发货'" class="order-status done">已发货</span>
          </div>
        </div>
        <div class="order-bottom">
          <div class="desc">实付￥{{item.pay_price}}元</div>
          <div class="pay" @click="_detailShow(item.id, $event)" v-show="item.status == '未支付'">付款</div>
          <div class="confirm" @click="_confirm(index, item.id)" v-show="item.status == '已发货'">确认收货</div>
          <div class="complete" @click="_detailShow(item.id, $event)" v-show="item.status == '订单已完成' || item.status == '已收货'">订单已完成</div>
          <div class="shut" @click="_detailShow(item.id, $event)" v-show="item.status == '订单已失效'">订单已失效</div>
        </div>
        <div class="split"></div>
      </div>
    </div>
    <div v-if="!orderCount" class="no-orders" @click="_goGoods">
      <span>没有订单数据，去下了一个吧~</span>
    </div>
    <orderdetail v-if="_checkShop(shop)" :from="from" :seller="shop" :sellerStatus="seller.status" :minPrice="seller.minPrice" v-on:loadorder="_loadData" ref="orderdetail"></orderdetail>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import orderdetail from '../orderdetail/orderdetail'
  import {getStorageSync} from '../../common/js/base'
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
        orderCount: true
      }
    },
    created() {
      console.log(this.orders)
      // 判断缓父组件是否传来this.seller
      // 是不做处理
      // 不是读取缓存中的shopId
      if (JSON.stringify(this.seller) === '{}') {
        console.log('orders强制刷新')
        this.shopId = getStorageSync('shopId')
        this.$axios.get('/wap/location/getshopbyid.html?id=' + this.shopId).then((res) => {
          if (res.code === 1) {
            this.shop = res.data
            this._loadData()
          } else {
            console.log(res)
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
        this.$axios.get('/wap/order/getOrders.html?id=' + this.shop.id).then((res) => {
          if (res.code === 1) {
            this.orders = res.data
            this.$nextTick(() => {
              this._initScroll()
            })
          } else {
            this.orderCount = false
            console.log(res)
          }
        })
      },
      _initScroll() {
        this.scroll = new BScroll(this.$refs.order, {
          click: true
        })
      },
      _detailShow(id, event) {
        if (!event._constructed) {
          return
        }
        this.$refs.orderdetail.show(id)
      },
      _goGoods() {
        this.$router.push({path: '/goods'})
      },
      _confirm(index, orderId) {
        if (confirm('确认收货吗？')) {
          console.log(orderId)
          let params = {
            id: orderId
          }
          this.$axios.post('wap/order/receive', params).then((res) => {
            console.log(res)
            if (res.code === 1) {
              this.orders[index].status = '已收货'
            } else {
              alert('刷新重试！')
            }
          })
        } else {
          return false
        }
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
        .complete
          color: #57ab53
        .shut
          color: #b42f2d
          text-decoration: line-through
      .split
        width: 100%
        height: 8px
        background: #f3f5f7
    .no-orders
      padding-top: 174px
      line-height: 36px
      font-size: 16px
      color: #00a0dc
      text-align: center
      text-decoration: underline
</style>
