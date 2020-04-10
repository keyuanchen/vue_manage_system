module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        components: '@/components',
        network: '@/network',
        views: '@/views',
        assets: '@/assets'
      }
    }
  },
  devServer: {
    host: 'localhost',
    port: 8080, // 端口号
    https: false, // https:{type:Boolean}
    open: true, //配置自动启动浏览器
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    hotOnly: true, // 热更新
    disableHostCheck: true
  }
}
