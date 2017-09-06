/**
 * Webpack config for tests
 */
module.exports = require('./webpack.base')({
  BUILD: false,
  TEST: true
});
