/**
 * Webpack config for builds
 */
module.exports = require('./webpack.base')({
  BUILD: true,
  TEST: false
});
