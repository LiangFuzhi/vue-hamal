const CompressionPlugin = require('compression-webpack-plugin') // Gzip
const path = require('path') //引入path模块
function resolve (dir) {
  return path.join(__dirname, dir)//path.join(__dirname)设置绝对路径
}
const isProduction = process.env.NODE_ENV === 'production'
module.exports = {
  productionSourceMap: false,
  publicPath: './dist',
  outputDir: 'dist',
  // assetsDir: 'static',
  pages: {
    index: {
      // page 的入口
      entry: "src/demo/main.js",
      // 模板来源
      template: "public/index.html",
      // 在 dist/index.html 的输出
      filename: "index.html",
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      // title: 'Index Page',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ["chunk-vendors", "chunk-common", "index"]
    }
  },
  configureWebpack: config => {
    if (isProduction) {
      const plugins = [
        // 文件开启Gzip，也可以通过服务端(如：nginx)(https://github.com/webpack-contrib/compression-webpack-plugin)
        new CompressionPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: /\.(js|css|html|svg)$/,
          threshold: 10240,
          minRatio: 0.8
        }),
        // Brotli压缩
        new CompressionPlugin({
          filename: '[path].br[query]',
          algorithm: 'brotliCompress',
          test: /\.(js|css|html|svg)$/,
          compressionOptions: { level: 11 },
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets: false
        })
      ]
      config.plugins = [...config.plugins, ...plugins]
    }
  },
  // css: { extract: false },
  transpileDependencies: [
    'vue-meta',
  ],
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('./src'))
      .set('vue-hamal', resolve('./src/index.js'))
    //set第一个参数：设置的别名，第二个参数：设置的路径

  }
}
