<template>
  <div class="order-detail">
    <div class="title">订单详情</div>
    <div class="receipt-info">
      <div class="contacts">
        <span>联系人:</span>
        <span>二狗</span>
      </div>
      <div class="phone">
        <span>联系电话:</span>
        <span>18645765422</span>
      </div>
      <div class="address">
        <span>收货地址(宿舍号):</span>
        <span>4栋232</span>
      </div>
    </div>
    <div class="goods-wrapper">
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
    <div class="order-account">
      <div class="total-count">付款合计</div>
      <div class="to-pay">去付款</div>
    </div>
  </div>
</template>

<script>
  export default {
    components: {}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .order-detail
    position: absolute
    width: 100%
    .title
      padding-left: 9px
      line-height: 46px
      color: #fff
      font-size: 16px
      background: rgba(0, 160, 220, 0.8)
      border-1px(rgba(7, 17, 27, 0.1))
    .receipt-info
      padding: 9px
      line-height: 32px
      color: rgb(7, 17, 27)
      font-size: 14px
      border-bottom: 10px solid #f3f5f7
      .contacts, .phone, .address
        border-1px(rgba(7, 17, 27, 0.1))
      .address
        color: rgb(147, 153, 159)
    .goods-wrapper
      .item
        display: flex
        padding: 9px
        color: #6D6D6D
        font-size: 14px
        line-height: 24px
        border-1px(rgba(7, 17, 27, 0.1))
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
      border-top: 1px solid #f3f5f7
      .total-count
        flex: 1
        padding-left: 8px
        color: #93312E
      .to-pay
        flex: 0 0 110px
        color: #fff
        text-align: center
        background: #00b43c
</style>
