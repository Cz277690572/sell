<template>
  <transition name="move">
    <div v-show="showFlag" class="order-detail" ref="orders">
    <div>
      <div class="title">
        <i class="icon-arrow_lift" @click="hidden()"></i>
        订单详情
      </div>
      <div v-show="from=='order'" class="order-info">
        <div class="order-summary">
          <div class="order-time-no">
            <div class="order-time">
              <span>下单时间:</span>
              <span class="text">20186565656565</span>
            </div>
            <div class="order-no">
              <span>订单编号:</span>
              <span class="text">20186565656565</span>
            </div>
          </div>
          <div class="order-status">
            <span class="unpay">未支付</span>
            <!--<text class="payed"></text>-->
            <!--<text class="done"></text>-->
          </div>
        </div>
        <div class="order-contact-info">
          <div class="user-info">
            <div class="name">
              <span>联系人:</span>
              <span class="text">阿猫</span>
            </div>
            <div class="phone">
              <span>手机号:</span>
              <span class="text">15220501265</span>
            </div>
          </div>
          <div class="address">
            <span>2栋622</span>
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
              <img height="64px" width="64px"
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
      <div class="order-account">
        <div class="total-count">付款合计: ￥{{totalPrice}}</div>
        <div class="to-pay" @click="chickPay">{{payDesc}}</div>
      </div>
    </div>
  </div>
  </transition>
</template>

<script>
  import BScroll from 'better-scroll'
  import {saveToLocal} from '../../common/js/cart'

  const ERR_OK = 0
  export default {
    props: {
      sellerId: {
        type: Number,
        default: 0
      },
      sellerStatus: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      },
      goods: {
        type: Array,
        default() {
          return []
        }
      },
      orderId: 0,
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
        payDesc: ''
      }
    },
    components: {},
    created() {
    },
    methods: {
      show() {
        console.log(this.from)
        console.log(this.goods)
        console.log(this.sellerId)
        console.log(this.sellerStatus)
        this.showFlag = true
        this.totalPrice = 0
        if (this.from === 'cart') {
          this.$http.get('/api/address').then((response) => {
            response = response.body
            if (response.errno === ERR_OK) {
              this.receipt = response.data
            }
          })
          this.goods.forEach((item) => {
            this.totalPrice += item['price'] * item['count']
          })
          this.$nextTick(() => {
            this._initScroll()
          })
          this._payDesc()
        } else if (this.from === 'order') {
          this.$http.get('/api/orderdetail').then((response) => {
            response = response.body
            console.log(response.data)
            if (response.errno === ERR_OK) {
              this.receipt.username = response.data.express_username
              this.receipt.phone = response.data.express_phone
              this.receipt.address = response.data.express_address
              this.receipt.desc = response.data.desc
            }
          })
        }
      },
      chickPay() {
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
        console.log('提交参数审核通过，提交订单,清空购物车，跳转至订单页面')
        // 求参数{"username":"阿猫","phone":"15220501265","address":"2栋622","desc":"不要加辣","goods":[{"goods_id":"2","count":"2"},{"goods_id":"1","count":"1"}]}
        this._emptyCart()
      },
      _payDesc() {
        if (this.sellerStatus === 0) {
          this.payDesc = '休息中'
        }
        if (this.totalPrice === 0) {
          this.payDesc = `￥${this.minPrice}元起送`
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice
          this.payDesc = `还差￥${diff}元起送`
        } else {
          this.payDesc = '去支付'
        }
      },
      _emptyCart() {
        this.goods.forEach((food) => {
          food.count = 0
          saveToLocal(this.sellerId, food.id, 'count', 0)
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
      line-height: 46px
      color: #fff
      font-size: 16px
      text-align: center
      background: rgba(0, 160, 220, 0.8)
      .icon-arrow_lift
        position: absolute
        left: 0
        top: 15px
        padding-left: 9px
    .order-info
      font-size: 14px
      height: 156px
      color: #999999
      .order-summary
        padding: 0 9px
        display: flex
        border-1px(rgba(7, 17, 27, 0.1))
        .order-time-no
          flex: 1
          line-height: 36px
          .order-time, .order-no
            .text
              color: #333
        .order-status
          flex: 0 0 64px
          line-height: 72px
          text-align: right
          color: red
      .order-contact-info
        padding: 1px 9px
        font-size: 14px
        line-height: 36px
        border-bottom: 10px solid #f3f5f7
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
      padding: 9px
      line-height: 32px
      color: rgb(7, 17, 27)
      font-size: 14px
      border-bottom: 10px solid #f3f5f7
      .contacts, .phone, .address, .desc
        border-1px(rgba(7, 17, 27, 0.1))
        input
          width: 100%
          height: 28px
          outline: none
    .goods
      border: 1px solid red
      position: fixed
      display: flex
      flex-direction: column
      top: 202px
      left: 0
      bottom: 48px
      overflow: hidden
      width: 100%
      .goods-wrapper
        .item
          display: flex
          padding: 9px
          color: #6D6D6D
          font-size: 14px
          line-height: 24px
          border-1px(rgba(7, 17, 27, 0.1))
          &:last-child
            border-none()
          .item-left
            flex: 0 0 64px
            margin-right: 10px
            img
              border-radius: 2px
          .item-middle
            flex: 1
          .item-right
            flex: 0 0 62px
            padding-right: 8px
            text-align: right
    .order-account
      position: fixed
      display: flex
      left: 0
      bottom: 0
      z-index: 100
      width: 100%
      height: 48px
      line-height: 48px
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
        background: #00b43c
</style>
