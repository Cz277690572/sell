<template>
  <transition name="move">
    <div v-show="showFlag" class="order-detail" ref="orders">
      <div class="title">
        <i class="icon-arrow_lift" @click="hidden()"></i>
        订单详情
      </div>
      <div v-show="from=='order'" class="order-info">
        <div class="order-summary">
          <div class="order-time-no">
            <div class="order-time">
              <span>下单时间:</span>
              <span class="text">{{order.create_at}}</span>
            </div>
            <div class="order-no">
              <span>订单编号:</span>
              <span class="text">{{order.order_no}}</span>
            </div>
          </div>
          <div class="order-status">
            <span v-show="order.status=='未支付'" class="unpay">未支付</span>
            <span v-show="order.status=='已付款'" class="payed">等待商家发货</span>
            <span v-show="order.status=='已发货'" class="done">已发货</span>
            <span v-show="order.status=='订单已完成' || order.status=='已收货'" class="complete">订单已完成</span>
            <span v-show="order.status=='订单已失效'" class="shut">订单已失效</span>
          </div>
        </div>
        <div class="order-contact-info">
          <div class="user-info">
            <div class="name">
              <span>联系人:</span>
              <span class="text">{{order.express_username}}</span>
            </div>
            <div class="phone">
              <span>手机号:</span>
              <span class="text">{{order.express_phone}}</span>
            </div>
          </div>
          <div class="address">
            <span>地址:</span>
            <span>{{order.express_address}}</span>
          </div>
          <div class="desc">
            <span>备注:</span>
            <span>{{order.desc || '无'}}</span>
          </div>
        </div>
      </div>
      <div v-show="from=='cart'" class="receipt-info">
        <div class="contacts">
          <input name="username" placeholder="联系人 (必填)" v-model="receipt.username" ref="username"/>
        </div>
        <div class="phone">
          <input name="phone" placeholder="联系手机号 (必填)" v-model="receipt.phone" ref="phone"/>
        </div>
        <div class="address">
          <input name="address" placeholder="收货地址 (必填)" v-model="receipt.address" ref="address"/>
        </div>
        <div class="desc">
          <input name="desc" placeholder="备注 (选填)" v-model="receipt.desc" ref="desc"/>
        </div>
      </div>
      <div class="goods" ref="goods">
        <div class="goods-wrapper">
          <div class="item" v-for="(item, index) in goods" :key="index">
            <div class="item-left">
              <img height="47px" width="47px"
                   :src="item.icon">
            </div>
            <div class="item-middle">
              <div class="good-name">{{item.name}}</div>
              <div class="good-price">￥{{item.price}}</div>
            </div>
            <div class="item-right">{{item.count}}</div>
          </div>
        </div>
      </div>
      <div class="order-account" v-show="orderStatus">
        <div class="total-count">付款合计: ￥{{totalPrice}}</div>
        <div class="to-pay" @click="checkPay" :class="payClass">{{payDesc}}</div>
      </div>
      <transition name="paymove">
        <div class="pay-wrapper" v-show="payShow">
          <div class="pay-result">
            <div class="success" v-show="payRes=='success'">
              <div class="pay-icon">
                <img width="64" height="64" src="./pay-success.png">
              </div>
              <div class="title">
                <span>支付成功！</span>
              </div>
              <div class="action">
                <div class="go-back" @click="_goBack">
                  <span>返回首页</span>
                </div>
                <div class="go-order" @click="_goOrder">
                  <span>查看订单</span>
                </div>
              </div>
            </div>
            <div class="error" v-show="payRes=='error'">
              <div class="pay-icon">
                <img width="64" height="64" src="./pay-error.png">
              </div>
              <div class="title">
                <span>支付失败！</span>
              </div>
              <div class="action">
                <div class="go-back" @click="_goBack">
                  <span>返回首页</span>
                </div>
                <div class="go-order" @click="_goOrder">
                  <span>重新支付</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
  import BScroll from 'better-scroll'
  import {saveToLocal} from '../../common/js/cart'

  export default {
    props: {
      seller: {
        type: Object
      },
      cartGoods: {
        type: Array,
        default() {
          return []
        }
      },
      from: ''
    },
    data() {
      return {
        showFlag: false,
        receipt: {},
        username: '',
        phone: '',
        address: '',
        desc: '',
        totalPrice: 0,
        payDesc: '',
        goods: [],
        order: {},
        orderStatus: false,
        payShow: false,
        payRes: ''
      }
    },
    created() {
    },
    computed: {
      payClass() {
        if (this.seller.status === 0) {
          return 'not-enough'
        }
        if (this.totalPrice < this.seller.start_price) {
          return 'not-enough'
        } else {
          return 'enough'
        }
      }
    },
    methods: {
      show(orderId = 0) {
        this.showFlag = true
        this.totalPrice = 0
        if (this.from === 'cart') {
          this.orderStatus = true
          this.$axios.get('/wap/member/getaddress.html').then((res) => {
            if (res.code === 1) {
              this.receipt = res.data
            }
          })
          this.goods = this.cartGoods
          this.goods.forEach((item) => {
            this.totalPrice += item['price'] * item['count']
          })
          this.$nextTick(() => {
            this._initScroll()
          })
          this._payDesc()
        } else if (this.from === 'order') {
          this.orderStatus = false
          this.$axios.get('/wap/order/getDetail.html?id=' + orderId).then((res) => {
              if (res.code === 1) {
                this.order = res.data
                this.goods = this.order.goodsList
                this.goods.forEach((item) => {
                  this.totalPrice += item['price'] * item['count']
                })
                this.$nextTick(() => {
                  this._initScroll()
                })
                if (this.order.status === '未支付') {
                  this.orderStatus = true
                  this._payDesc()
                }
              } else {
                console.log(res)
              }
          })
        }
      },
      checkPay() {
        if (this.from === 'cart') {
          this._fromCart()
        } else if (this.from === 'order') {
          this._fromOrder()
        }
      },
      _fromCart() {
        this.username = this.$refs.username.value
        this.phone = this.$refs.phone.value
        this.address = this.$refs.address.value
        this.desc = this.$refs.desc.value
        if (!this.username) {
          alert('联系人不能为空！')
          return
        }
        let retPhone = /^[0-9]{11}$/
        if (!retPhone.test(this.phone)) {
          alert('手机号码格式错误！')
          return
        }
        if (!this.address) {
          alert('收货地址不能为空！')
          return
        }
        let params = {
          username: this.username,
          phone: this.phone,
          address: this.address,
          desc: this.desc,
          goods: []
        }
        this.goods.forEach((item) => {
          params.goods.push({goods_id: item.id, count: item.count})
        })
        this.$axios.post('/wap/order/placeorder', params).then((res) => {
          console.log(res)
          if (res.code === 1) {
            this.payShow = true
            this.payRes = 'success'
          } else {
          }
        })
        // console.log('提交参数审核通过，提交订单;返回订单id,清空购物车,提交订单id，拉起微信支付，返回支付结果, 跳转至支付结果')
        // 求参数{"username":"阿猫","phone":"15220501265","address":"2栋622","desc":"不要加辣","goods":[{"goods_id":"2","count":"2"},{"goods_id":"1","count":"1"}]}
        // this.payShow = true
        // this.payRes = 'success'
      },
      _goBack() {
        if (this.from === 'cart') {
          this.payShow = false
          this.showFlag = false
          this._emptyCart()
        } else if (this.from === 'order') {
          this.$router.push({path: '/goods'})
        }
      },
      _goOrder() {
        if (this.from === 'cart') {
          this._emptyCart()
          this.$router.push({path: '/orders'})
        } else if (this.from === 'order') {
          this.$emit('loadorder')
          this.payShow = false
          this.showFlag = false
        }
      },
      _fromOrder() {
        console.log('提交订单ID，拉起微信支付, 返回支付结果, 跳转至支付结果')
        this.payShow = true
        this.payRes = 'success'
      },
      _payDesc() {
        if (this.seller.status === 0) {
          this.payDesc = '休息中'
        }
        if (this.totalPrice === 0) {
          this.payDesc = `￥${this.seller.start_price}元起送`
        } else if (this.totalPrice < this.seller.start_price) {
          let diff = this.seller.start_price - this.totalPrice
          this.payDesc = `还差￥${diff}元起送`
        } else {
          this.payDesc = '去支付'
        }
      },
      _emptyCart() {
        this.cartGoods.forEach((food) => {
          food.count = 0
          saveToLocal(this.seller.id, food.id, 'count', 0)
        })
      },
      _initScroll() {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.goods, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      },
      hidden() {
        this.showFlag = false
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/index.styl"
  .order-detail
    position: fixed
    left: 0
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: #fff
    transform: translate3d(0, 0, 0)
    &.move-enter-active, &.move-leave-active
      transition: all 0.2s linear
    &.move-enter, &.move-leave-active
      transform: translate3d(100%, 0, 0)
    .title
      padding-left: 9px
      line-height: 36px
      color: #fff
      font-size: 16px
      text-align: center
      background: rgba(0, 160, 220, 0.8)
      .icon-arrow_lift
        position: absolute
        left: 0
        top: 9px
        padding-left: 9px
    .order-info
      font-size: 12px
      height: 112px
      color: #999999
      .order-summary
        padding: 0 4px
        display: flex
        border-1px(rgba(7, 17, 27, 0.1))
        .order-time-no
          flex: 0 0 205px
          line-height: 24px
          .order-time, .order-no
            .text
              color: #333
        .order-status
          flex: 1
          line-height: 48px
          text-align: right
          .unpay, .shut
            color: red
          .payed
            color: #DDB477
          .done, .complete
            color: #57AB53
      .order-contact-info
        padding: 1px 4px
        font-size: 12px
        line-height: 21px
        border-bottom: 8px solid #f3f5f7
        .user-info
          display: flex
          .name
            flex: 1
          .phone
            flex: 1
            text-align: right
          .name, .phone
            .text
              color: #333
    .receipt-info
      padding: 4px
      line-height: 22px
      color: rgb(7, 17, 27)
      font-size: 14px
      border-bottom: 8px solid #f3f5f7
      .contacts, .phone, .address, .desc
        border-1px(rgba(7, 17, 27, 0.1))
        input
          width: 100%
          height: 26px
          outline: none
    .goods
      position: fixed
      display: flex
      flex-direction: column
      top: 156px
      left: 0
      bottom: 0px
      overflow: hidden
      width: 100%
      .goods-wrapper
        .item
          display: flex
          padding: 4px
          color: #6D6D6D
          font-size: 12px
          line-height: 22px
          border-1px(rgba(7, 17, 27, 0.1))
          &:last-child
            margin-bottom: 38px
          .item-left
            flex: 0 0 47px
            margin-right: 10px
            img
              border-radius: 2px
          .item-middle
            flex: 1
          .item-right
            flex: 0 0 62px
            padding-right: 4px
            text-align: right
    .order-account
      position: fixed
      display: flex
      left: 0
      bottom: 0
      z-index: 100
      width: 100%
      height: 38px
      line-height: 38px
      font-size: 14px
      background: #141d27
      border-top: 1px solid #f3f5f7
      .total-count
        flex: 1
        padding-left: 8px
        color: #fff
      .to-pay
        flex: 0 0 110px
        color: #fff
        text-align: center
        &.not-enough
          background: #2b333b
        &.enough
          background: #00b43c
          color: #fff
    .pay-wrapper
      opacity: 1
      position: fixed
      z-index: 200
      top: 0
      left: 0
      bottom: 0
      width: 100%
      height: 100%
      backdrop-filter: blur(10px)
      background: rgba(7, 17, 27, 0.8)
      backdrop-filter: blur(10px)
      &.paymove-enter-active, &.paymove-leave-active
        transition: all 0.5s
      &.paymove-enter, &.paymove-leave-to
        opacity: 0
        background: rgba(7, 17, 27, 0)
      .pay-result
        margin: 70px 42px
        width: 200px
        height: 250px
        padding: 8px 8px
        border-radius: 8px
        background: #fff
        .success, .error
          .pay-icon
            padding: 48px 0 28px 0
            text-align: center
          .title
            line-height: 48px
            font-size: 28px
            background: #fff
            color: #57AB53
          .action
            display: flex
            text-align: center
            line-height: 28px
            font-size: 14px
            .go-back
              flex: 1
              margin: 10px 10px
              color: rgb(7, 17, 27)
              border: 1px solid #57AB53
              border-radius: 5px
            .go-order
              flex: 1
              color: #fff
              border-radius: 5px
              background: #57AB53
              margin: 10px 10px
        .error
          .title
            color: #DDB477
          .action
            .go-back
              border: 1px solid rgba(7, 17, 27, 0.8)
            .go-order
              border: 1px solid #DDB477
              background: #DDB477
</style>
