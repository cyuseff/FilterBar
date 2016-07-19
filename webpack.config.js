var path = require('path');
var webpack = require('webpack');
var bundle;

console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === 'production') {
  bundle = {
    entry: './src/index',
    output: {
      path: path.join(__dirname, 'public'),
      filename: 'app.js'
    },
    module: {
      loaders: [
        {
          test: /.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          query: {
            presets: ['es2015', 'react']
          }
        }
      ]
    },
    resolve: {
      extensions: ['', '.js', '.jsx']
    }
  };
} else {
  bundle = {
    devtool: 'eval',
    entry: [
      'webpack-dev-server/client?http://localhost:5000',
      'webpack/hot/only-dev-server',
      './src/index'
    ],
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'bundle.js',
      publicPath: '/static/'
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ],
    module: {
      loaders: [{
        test: /\.jsx?$/,
        loaders: ['react-hot', 'babel-loader'],
        include: path.join(__dirname, 'src')
      }]
    },
    resolve: {
      extensions: ['', '.js', '.jsx']
    }
  };
}

module.exports = bundle;
