
module.exports = {
  dev: {
    publicPath: '/',
    devtool: 'cheep-module-eval-source-map',
    host: '0.0.0.0',
    proxyTable: {},
    autoOpenBrowser: true,
    cssSourceMap: true
  },
  build: {
    publicPath: '/',
    devtool: false,
    host: '',
    proxyTable:{},
    autoOpenBrowser: false,
    cssSourceMap: false
  }
}