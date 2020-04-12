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
  },
  // 自定义打包入口
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'production', config => {
      config
        .entry('app')
        .clear()
        .add('./src/prod.js')

      // 配置externals,可以设置哪些第三方包不进行打包处理, 从而让打包的文件体积变小
      config.set('externals', {
        vue: 'Vue',
        'vue-quill-editor': 'VueQuillEditor',
        lodash: '_',
        axios: 'axios',
        nprogress: 'NProgress',
        echarts: 'echarts'
      })
      // 配置插件实现首页的自定制
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })

    config.when(process.env.NODE_ENV === 'development', config => {
      config
        .entry('app')
        .clear()
        .add('./src/dev.js')

      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}
