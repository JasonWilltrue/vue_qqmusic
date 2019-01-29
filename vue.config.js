const webpack = require('webpack')
const path = require('path')


function resolve(dir) {
  return path.join(__dirname, "..",dir)
}

module.exports = {
  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        'import': [
          './src/common/less/index.less'
        ]
      }
    }
  },
  devServer: {
     open:true
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
  baseUrl: ''
}
