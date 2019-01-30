const webpack = require('webpack')
const path  = require('path')
const axios = require('axios')

module.exports = {
  devServer: {
    port: 8080,
    host: 'localhost',
    open: true,
    // proxy: 'http://localhost:4000' // 配置跨域处理,只有一个代理
    // proxy: {
    //   '/api': {
    //     target      : 'https://c.y.qq.com',
    //     ws          : true,
    //     changeOrigin: true
    //   }
    // },
    before: function (app, server) {
      app.get('/api/getDiscList', function (req, res) {
        let url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host   : 'c.y.qq.com'
          },
          params: req.query
        }).then(response => {
          res.json(response.data)
        }).catch(e => {
          console.log(e)
        })

      });
    }
  },
  chainWebpack(config) {
    config.resolve.alias
      .set('components', path.resolve(__dirname, 'src/components'))
      .set('common', path.resolve(__dirname, 'src/common'))
      .set('api', path.resolve(__dirname, 'src/api'))
      .set('base', path.resolve(__dirname, 'src/base'))

    config.plugin('context')
      .use(webpack.ContextReplacementPlugin,
        [/moment[/\\]locale$/, /zh-cn/])
  },
  baseUrl: '',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false
}
