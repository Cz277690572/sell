<template>
  <div id="app">
    <orderdetail></orderdetail>
  </div>
</template>

<script>
  import orderdetail from './components/orderdetail/orderdetail'
  // import shoplist from './components/shoplist/shoplist'
  export default {
    data() {
      return {}
    },
    components: {
      'orderdetail': orderdetail
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
