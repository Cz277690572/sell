<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count>0" @click="decreaseCart">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click="addCart"></div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {saveToLocal, loadFromLocal} from '../../common/js/cart'

  export default {
    props: {
      food: {
        type: Object
      },
      sellerId: {
        type: Number,
        default: 0
      }
    },
    created() {
      let count = loadFromLocal(this.sellerId, this.food.id, 'count', 0)
      Vue.set(this.food, 'count', count)
    },
    methods: {
      // 将购车的商品加入缓存，初始化时判断缓存中是否存在商品id，有取出加入this.food.count;无略过
      addCart(event) {
        if (!event._constructed) {
          return
        }
        if (!this.food.count) {
          this.food.count = 1
        } else {
          this.food.count++
        }
        saveToLocal(this.sellerId, this.food.id, 'count', this.food.count)
        this.$emit('cart-add', event.target)
      },
      decreaseCart(event) {
        if (!event._constructed) {
          return
        }
        if (this.food.count) {
          this.food.count--
        } else {
          this.food.count = 0
        }
        saveToLocal(this.sellerId, this.food.id, 'count', this.food.count)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size: 0px
    .cart-decrease // .move 与 .cart-decrease 是 同级关系
      display: inline-block
      padding: 6px
      transition: all 0.4s linear
      &.move-transition
        opacity: 1
        transform: translate3d(0, 0, 0)
      .inner
        display: inline-block
        line-height: 24px
        font-size: 24px
        color: rgb(0, 160, 220)
        transition: all 0.4s linear
        transform: rotate(0)
      &.move-enter, &.move-leave
        opacity: 0
        transform: translate3d(24px, 0, 0)
      .inner
        transform: rotate(180deg)
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147, 153, 159)
    .cart-add
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)
</style>
