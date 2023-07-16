const path = require('path')
const reactWebpack = require('./react.webpack.js');

const rootPath = path.resolve(__dirname, '..')

module.exports = {
  ...reactWebpack,
  output: {
    path: path.resolve(rootPath, 'dist/web'),
    filename: 'js/[name].js',
    publicPath: '/',
  },
  target: 'web'
};
