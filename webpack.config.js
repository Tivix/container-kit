var webpack = require('webpack');
const path = require('path');


module.exports = {
  entry: {
    app: ['webpack/hot/dev-server', './js/App.js'],
  },
  output: {
    path: path.resolve(__dirname, 'public/built'),
    filename: 'bundle.js',
    publicPath: 'http://localhost:8080/built/'
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    publicPath: 'http://localhost:8080/built/'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
   loaders: [
     {
       test: /\.jsx?$/,
       loader: 'babel-loader',
       exclude: /node_modules/,
       query: {
         presets: ['react', 'es2015']
       }
     },
     { test: /\.css$/, loader: 'style-loader!css-loader' },
     { test: /\.less$/, loader: 'style-loader!css-loader!less-loader'},
     { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
     {
       test: /node_modules\/.*\.js$/,
       loader: 'shebang-loader',
     }
   ]
  },
  target: 'electron',
  node: {
    fs: "empty"
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    //new webpack.IgnorePlugin(new RegExp("^(fs|ipc)$"))
  ]
}
