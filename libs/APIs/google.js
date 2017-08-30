var _Google = require('./_google')

function Google () {
  _Google.call(this)
  this.name = '谷歌翻译'
  this.type = 'Google'
  this.apiRoot = this.link = 'https://translate.google.com'
  // 若想在浏览器中使用谷歌翻译，
  // 可以将 this.apiRoot 设为 'https://translate.googleapis.com'
  // 这个接口是可跨域访问的
}

Google.prototype = Object.create(_Google.prototype, {
  constructor: { value: Google }
})

module.exports = Google
