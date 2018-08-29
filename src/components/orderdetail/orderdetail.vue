<template>
  <div v-show="showFlag" class="order-detail">
    <div class="title">
      <i class="icon-arrow_lift"></i>订单详情
    </div>
    <div class="receipt-info">
      <div class="contacts">
        <input name="username" placeholder="联系人" v-model="receipt.username" ref="username"/>
      </div>
      <div class="phone">
        <input name="phone" placeholder="联系手机号" v-model="receipt.phone" ref="phone"/>
      </div>
      <div class="address">
        <input name="address" placeholder="收货地址" v-model="receipt.address" ref="address"/>
      </div>
    </div>
    <div class="goods" ref="goods">
      <div class="goodsWrapper">
        <div class="item">
          <div class="item-left">
            <img height="64px" width="64px"
                 src="http://fuss10.elemecdn.com/6/72/cb844f0bb60c502c6d5c05e0bddf5jpeg.jpeg?imageView2/1/w/114/h/114">
          </div>
          <div class="item-middle">
            <div class="good-name">gname</div>
            <div class="good-price">gprice</div>
          </div>
          <div class="item-right">x1</div>
        </div>
        <div class="item">
          <div class="item-left">
            <img height="64px" width="64px"
                 src="http://fuss10.elemecdn.com/6/72/cb844f0bb60c502c6d5c05e0bddf5jpeg.jpeg?imageView2/1/w/114/h/114">
          </div>
          <div class="item-middle">
            <div class="good-name">gname</div>
            <div class="good-price">gprice</div>
          </div>
          <div class="item-right">x1</div>
        </div>
        <div class="item">
          <div class="item-left">
            <img height="64px" width="64px"
                 src="http://fuss10.elemecdn.com/6/72/cb844f0bb60c502c6d5c05e0bddf5jpeg.jpeg?imageView2/1/w/114/h/114">
          </div>
          <div class="item-middle">
            <div class="good-name">gname</div>
            <div class="good-price">gprice</div>
          </div>
          <div class="item-right">x1</div>
        </div>
        <div class="item">
          <div class="item-left">
            <img height="64px" width="64px"
                 src="http://fuss10.elemecdn.com/6/72/cb844f0bb60c502c6d5c05e0bddf5jpeg.jpeg?imageView2/1/w/114/h/114">
          </div>
          <div class="item-middle">
            <div class="good-name">gname</div>
            <div class="good-price">gprice</div>
          </div>
          <div class="item-right">x1</div>
        </div>
        <div class="item">
          <div class="item-left">
            <img height="64px" width="64px"
                 src="http://fuss10.elemecdn.com/6/72/cb844f0bb60c502c6d5c05e0bddf5jpeg.jpeg?imageView2/1/w/114/h/114">
          </div>
          <div class="item-middle">
            <div class="good-name">gname</div>
            <div class="good-price">gprice</div>
          </div>
          <div class="item-right">x1</div>
        </div>
        <div class="item">
        <div class="item-left">
          <img height="64px" width="64px"
               src="http://fuss10.elemecdn.com/6/72/cb844f0bb60c502c6d5c05e0bddf5jpeg.jpeg?imageView2/1/w/114/h/114">
        </div>
        <div class="item-middle">
          <div class="good-name">gname</div>
          <div class="good-price">gprice</div>
        </div>
        <div class="item-right">x1</div>
      </div>
        <div class="item">
          <div class="item-left">
            <img height="64px" width="64px"
                 src="http://fuss10.elemecdn.com/6/72/cb844f0bb60c502c6d5c05e0bddf5jpeg.jpeg?imageView2/1/w/114/h/114">
          </div>
          <div class="item-middle">
            <div class="good-name">gname</div>
            <div class="good-price">gprice</div>
          </div>
          <div class="item-right">x1</div>
        </div>
        <div class="item">
          <div class="item-left">
            <img height="64px" width="64px"
                 src="http://fuss10.elemecdn.com/6/72/cb844f0bb60c502c6d5c05e0bddf5jpeg.jpeg?imageView2/1/w/114/h/114">
          </div>
          <div class="item-middle">
            <div class="good-name">gname</div>
            <div class="good-price">gprice</div>
          </div>
          <div class="item-right">x1</div>
        </div>
      </div>
    </div>
    <div class="order-account">
      <div class="total-count">付款合计: ￥19.99元</div>
      <div class="to-pay" @click="chickPay">去付款</div>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  const ERR_OK = 0
  export default {
    data() {
      return {
        showFlag: true,
        receipt: {},
        username: '',
        phone: '',
        address: '',
        goods: [],
        totalCount: ''
      }
    },
    components: {},
    created() {
      this.$http.get('/api/address').then((response) => {
        response = response.body
        if (response.errno === ERR_OK) {
          this.receipt = response.data
          this._initScroll()
        }
      })
    },
    methods: {
      chickPay() {
        this.username = this.$refs.username.value
        this.phone = this.$refs.phone.value
        this.address = this.$refs.address.value
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
        console.log(this.username)
      },
      _initScroll() {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.goods, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/index.styl"
  .order-detail
    position: fixed
    z-index: 50
    width: 100%
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
    .receipt-info
      padding: 9px
      line-height: 32px
      color: rgb(7, 17, 27)
      font-size: 14px
      border-bottom: 10px solid #f3f5f7
      .contacts, .phone, .address
        border-1px(rgba(7, 17, 27, 0.1))
        input
          width: 100%
          height: 28px
          outline: none
      .address
        color: rgb(147, 153, 159)
    .goods
      position: fixed
      top: 170px
      left: 0
      bottom: 38px
      width: 100%
      z-index: 50
      overflow: hidden
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
          flex: 1
          padding-right: 8px
          text-align: right
    .order-account
      position: fixed
      display: flex
      left: 0
      bottom: 0
      z-index: 50
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
        background: #00b43c
</style>
