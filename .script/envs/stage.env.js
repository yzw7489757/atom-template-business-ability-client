const pkg = require('../../package.json');

module.exports = {
  PUBLIC_URL: `/`,
  APP_PROTOCOL: `http`,
  APP_BASE_URL: pkg.name,
  APP_DOMAIN: `//${pkg.name}.localhost.cn/`,
}