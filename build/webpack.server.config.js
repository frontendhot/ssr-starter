const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = merge(base, {
  target: 'node',
  devtool: false, //'#source-map', ???
  entry: './server/entry.js',
  output: {
    path: path.resolve(__dirname, '../dist/server'),
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {},
  // https://webpack.js.org/configuration/externals/#externals
  // https://github.com/liady/webpack-node-externals
  externals: nodeExternals({
    // do not externalize CSS files in case we need to import it from a dep
    whitelist: /\.css$/
  }),
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"server"'
    }),
    new VueSSRServerPlugin(),
    new CopyWebpackPlugin([
      {
        from:{
          glob: path.resolve(__dirname, '../server/**/*'),
          ignore: [path.resolve(__dirname, '../server/entry.js')]
        },
        to:path.resolve(__dirname, '../dist')
      },
    ])
  ]
})



