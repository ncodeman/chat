const path = require('path')
const VueLoader = require('vue-loader/lib/plugin')
const HtmlWebpack = require('html-webpack-plugin')
const CleanWebpack = require('clean-webpack-plugin')
const CopyWebpack = require('copy-webpack-plugin')

module.exports = {
  entry: {
    app: 'client/app.js',
    vendor: ['vue', 'vue-router', 'axios']
  },
  output: {
    publicPath: '/dist/',
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[chunkhash].js'
  },
  resolve: {
    modules: [path.resolve(__dirname, ',.'), 'node_modules'],
    extensions: ['.js', '.vue'],
    alias: {
      'client': path.resolve(__dirname, './'),
      'assets': path.resolve(__dirname, 'assets')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          }, {
            loader: 'css-loader'
          }]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[hash].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[hash].[ext]'
        }
      }
    ]
  },
  plugins: [
    new VueLoader(),
    new CleanWebpack([path.resolve(__dirname, 'dist')]),
    new HtmlWebpack({
      filename: path.resolve(__dirname, 'dist/index.html'),
      template: path.resolve(__dirname, 'index.html'),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }
    }),
    new CopyWebpack([{
      from: path.resolve(__dirname, 'assets/static'),
      to: path.resolve(__dirname, 'dist/static'),
      ignore: ['.*']
    }])
  ]
}