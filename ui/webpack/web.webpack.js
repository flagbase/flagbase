const reactWebpack = require('./react.webpack.js');

module.exports = {
  ...reactWebpack,
  target: 'web'
};
