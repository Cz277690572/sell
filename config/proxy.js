

/**
 * base_url 后台服务器路径
 */
var base_url = 'http://www.xialangschool.cn/';
var proxyList = {
    base_url: base_url,
    '/wap': {
      // 测试环境
      target: base_url,  // 接口域名
      changeOrigin: true,  //是否跨域
      pathRewrite: {}
    }
}
module.exports = { 
  proxyList
}
